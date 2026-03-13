import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { DashboardQueryDto } from '../dto/dashboard-query.dto';
import { FindAttendanceReportQueryDto } from '../dto/find-attendance-report-query.dto';

@Injectable()
export class ReportsService {
  constructor(
    @Inject('ATTENDANCE_MS') private readonly attendanceMs: ClientProxy,
  ) {}

  getDashboardStats(query?: DashboardQueryDto) {
    return firstValueFrom(this.attendanceMs.send('reports.dashboard', query));
  }

  getAttendanceReport(query: FindAttendanceReportQueryDto) {
    return firstValueFrom(this.attendanceMs.send('reports.attendance', query));
  }
}
