import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';

import { Attendance } from '../../../database/entities/attendance.entity';

@Injectable()
export class AttendanceRepository {
  constructor(
    @InjectRepository(Attendance)
    private readonly repo: Repository<Attendance>,
  ) {}

  findToday(employeeId: string, date: Date) {
    return this.repo.findOne({
      where: {
        employee_id: employeeId,
        attendance_date: date,
      },
    });
  }

  findPendingCheckoutToday() {
    return this.repo.find({
      where: {
        check_out: IsNull(),
        check_in: Not(IsNull()),
        attendance_date: new Date(new Date().setHours(0, 0, 0, 0)),
        status: 'CHECKED_IN',
      },
    });
  }

  createAttendance(data: Partial<Attendance>) {
    return this.repo.save(data);
  }

  updateAttendance(id: string, data: Partial<Attendance>) {
    return this.repo.update(id, data);
  }
}
