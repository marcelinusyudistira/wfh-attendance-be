import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';

import { Attendance } from '../../../database/entities/attendance.entity';
import { DashboardQueryDto } from '../dto/dashboard-query.dto';
import { FindAttendanceReportQueryDto } from '../dto/find-attendance-report-query.dto';

type AttendanceStatus =
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'ABSENT'
  | 'AUTO_CHECKOUT';

type EmployeeLite = {
  id: string;
  name: string;
  employee_code: string;
};

function toYmd(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function fromYmd(ymd: string): Date {
  const [y, m, d] = ymd.split('-').map(Number);
  const result = new Date(y, (m ?? 1) - 1, d ?? 1);
  result.setHours(0, 0, 0, 0);
  return result;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function initDailySeries(
  startDate: Date,
  endDate: Date,
): {
  days: Array<{ date: string } & Record<AttendanceStatus, number>>;
  dayIndex: Map<string, number>;
} {
  const days: Array<{ date: string } & Record<AttendanceStatus, number>> = [];
  const dayIndex = new Map<string, number>();

  const endYmd = toYmd(endDate);
  for (let i = 0; ; i++) {
    const date = toYmd(addDays(startDate, i));
    days.push({
      date,
      CHECKED_IN: 0,
      CHECKED_OUT: 0,
      ABSENT: 0,
      AUTO_CHECKOUT: 0,
    });
    dayIndex.set(date, i);
    if (date === endYmd) break;
  }

  return { days, dayIndex };
}

function applyDailyRaw(
  days: Array<{ date: string } & Record<AttendanceStatus, number>>,
  dayIndex: Map<string, number>,
  dailyRaw: Array<{ date: string; status: AttendanceStatus; count: string }>,
) {
  const statusKeys: AttendanceStatus[] = [
    'CHECKED_IN',
    'CHECKED_OUT',
    'ABSENT',
    'AUTO_CHECKOUT',
  ];
  const statusSet = new Set<AttendanceStatus>(statusKeys);

  const ymdRegex = /\d{4}-\d{2}-\d{2}/;

  for (const row of dailyRaw) {
    const rawDate: unknown = (row as unknown as { date: unknown }).date;
    let date: string | undefined;

    if (rawDate instanceof Date) {
      date = toYmd(rawDate);
    } else if (typeof rawDate === 'string') {
      const match = ymdRegex.exec(rawDate);
      date = match?.[0];
    } else {
      date = undefined;
    }

    if (!date) continue;
    const idx = dayIndex.get(date);
    if (idx === undefined) continue;
    if (!statusSet.has(row.status)) continue;
    days[idx][row.status] = Number(row.count) || 0;
  }
}

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,

    @Inject('EMPLOYEE_MS')
    private readonly employeeClient: ClientProxy,
  ) {}

  private async getEmployeeIdsByDepartment(departmentId: string) {
    return firstValueFrom(
      this.employeeClient.send<string[]>('employees.findIdsByDepartment', {
        departmentId,
      }),
    );
  }

  private async countEmployees(departmentId?: string) {
    return firstValueFrom(
      this.employeeClient.send<number>('employees.count', { departmentId }),
    );
  }

  private async searchEmployeeIds(search: string) {
    return firstValueFrom(
      this.employeeClient.send<string[]>('employees.searchIds', { search }),
    );
  }

  private async findEmployeesLiteByIds(ids: string[]): Promise<EmployeeLite[]> {
    return firstValueFrom(
      this.employeeClient.send<EmployeeLite[]>('employees.findLiteByIds', {
        ids,
      }),
    );
  }

  async getDashboardStats(query?: DashboardQueryDto) {
    const departmentId = query?.department_id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayYmd = toYmd(today);
    const startParam = query?.start_date
      ? query.start_date.slice(0, 10)
      : undefined;
    const endParam = query?.end_date ? query.end_date.slice(0, 10) : undefined;

    let startYmd = startParam ?? endParam ?? todayYmd;
    let endYmd = endParam ?? startParam ?? todayYmd;

    if (startYmd > endYmd) {
      [startYmd, endYmd] = [endYmd, startYmd];
    }

    const startDate = fromYmd(startYmd);
    const endDate = fromYmd(endYmd);

    const totalEmployees = await this.countEmployees(departmentId);

    let departmentEmployeeIds: string[] | undefined;
    if (departmentId) {
      departmentEmployeeIds =
        await this.getEmployeeIdsByDepartment(departmentId);
      if (departmentEmployeeIds.length === 0) {
        const { days } = initDailySeries(startDate, endDate);
        return {
          total_employees: totalEmployees,
          range: {
            start_date: startYmd,
            end_date: endYmd,
            department_id: departmentId,
          },
          summary: {
            checked_in: 0,
            present: 0,
            absent: 0,
            auto_checkout: 0,
            pending_checkout_today: 0,
          },
          daily: days,
        };
      }
    }

    const statusTotalsQb = this.attendanceRepo
      .createQueryBuilder('attendance')
      .select('attendance.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('attendance.attendance_date BETWEEN :start AND :end', {
        start: startYmd,
        end: endYmd,
      });

    if (departmentEmployeeIds) {
      statusTotalsQb.andWhere('attendance.employee_id IN (:...employeeIds)', {
        employeeIds: departmentEmployeeIds,
      });
    }

    const statusTotalsRaw = await statusTotalsQb
      .groupBy('attendance.status')
      .getRawMany<{ status: AttendanceStatus; count: string }>();

    const statusTotals: Record<AttendanceStatus, number> = {
      CHECKED_IN: 0,
      CHECKED_OUT: 0,
      ABSENT: 0,
      AUTO_CHECKOUT: 0,
    };

    for (const row of statusTotalsRaw) {
      if (row.status in statusTotals) {
        statusTotals[row.status] = Number(row.count) || 0;
      }
    }

    const dailyQb = this.attendanceRepo
      .createQueryBuilder('attendance')
      .select('attendance.attendance_date', 'date')
      .addSelect('attendance.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('attendance.attendance_date BETWEEN :start AND :end', {
        start: startYmd,
        end: endYmd,
      });

    if (departmentEmployeeIds) {
      dailyQb.andWhere('attendance.employee_id IN (:...employeeIds)', {
        employeeIds: departmentEmployeeIds,
      });
    }

    const dailyRaw = await dailyQb
      .groupBy('attendance.attendance_date')
      .addGroupBy('attendance.status')
      .orderBy('attendance.attendance_date', 'ASC')
      .getRawMany<{ date: string; status: AttendanceStatus; count: string }>();

    const { days, dayIndex } = initDailySeries(startDate, endDate);
    applyDailyRaw(days, dayIndex, dailyRaw);

    const pendingCheckoutQb = this.attendanceRepo
      .createQueryBuilder('attendance')
      .where('attendance.attendance_date = :date', { date: endYmd })
      .andWhere('attendance.status = :status', { status: 'CHECKED_IN' })
      .andWhere('attendance.check_out IS NULL');

    if (departmentEmployeeIds) {
      pendingCheckoutQb.andWhere(
        'attendance.employee_id IN (:...employeeIds)',
        {
          employeeIds: departmentEmployeeIds,
        },
      );
    }

    const pendingCheckoutToday = await pendingCheckoutQb.getCount();

    return {
      total_employees: totalEmployees,
      range: {
        start_date: startYmd,
        end_date: endYmd,
        department_id: departmentId,
      },
      summary: {
        checked_in: statusTotals.CHECKED_IN,
        present: statusTotals.CHECKED_OUT,
        absent: statusTotals.ABSENT,
        auto_checkout: statusTotals.AUTO_CHECKOUT,
        pending_checkout_today: pendingCheckoutToday,
      },
      daily: days,
    };
  }

  async getAttendanceReport(query: FindAttendanceReportQueryDto) {
    const {
      start_date,
      end_date,
      employee_id,
      status,
      search,
      page = '1',
      limit = '10',
    } = query ?? {};

    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = Math.max(1, Number(limit) || 10);

    let employeeIdsFilter: string[] | undefined;
    if (search) {
      employeeIdsFilter = await this.searchEmployeeIds(search);
      if (employeeIdsFilter.length === 0) {
        return { data: [], total: 0, page: pageNumber, limit: limitNumber };
      }
    }

    const qb = this.attendanceRepo.createQueryBuilder('attendance');

    if (start_date && end_date) {
      qb.andWhere('attendance.attendance_date BETWEEN :start AND :end', {
        start: start_date,
        end: end_date,
      });
    } else if (start_date) {
      qb.andWhere('attendance.attendance_date >= :start', {
        start: start_date,
      });
    } else if (end_date) {
      qb.andWhere('attendance.attendance_date <= :end', { end: end_date });
    }

    if (status) {
      qb.andWhere('attendance.status = :status', { status });
    }

    if (employee_id) {
      qb.andWhere('attendance.employee_id = :employee_id', { employee_id });
    }

    if (employeeIdsFilter) {
      qb.andWhere('attendance.employee_id IN (:...employeeIds)', {
        employeeIds: employeeIdsFilter,
      });
    }

    qb.orderBy('attendance.attendance_date', 'DESC');
    qb.skip((pageNumber - 1) * limitNumber);
    qb.take(limitNumber);

    const [data, total] = await qb.getManyAndCount();

    const uniqueEmployeeIds = Array.from(
      new Set(data.map((a) => a.employee_id).filter(Boolean)),
    );

    const employeesLite = uniqueEmployeeIds.length
      ? await this.findEmployeesLiteByIds(uniqueEmployeeIds)
      : [];

    const employeeMap = new Map<string, EmployeeLite>();
    for (const e of employeesLite) {
      employeeMap.set(e.id, e);
    }

    const enriched = data.map((a) => {
      const employee = employeeMap.get(a.employee_id);
      return {
        ...a,
        employee: employee
          ? {
              id: employee.id,
              name: employee.name,
              employee_code: employee.employee_code,
            }
          : { id: a.employee_id, name: null, employee_code: null },
      };
    });

    return {
      data: enriched,
      total,
      page: pageNumber,
      limit: limitNumber,
    };
  }
}
