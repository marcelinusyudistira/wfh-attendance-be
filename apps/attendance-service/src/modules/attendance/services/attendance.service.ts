import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { AttendanceRepository } from '../repositories/attendance.repository';

@Injectable()
export class AttendanceService {
  constructor(private readonly attendanceRepo: AttendanceRepository) {}

  private badRequest(message: string): never {
    throw new RpcException({ statusCode: 400, message });
  }

  async checkIn(
    employeeId: string,
    photo: string,
    latitude: number,
    longitude: number,
  ) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAttendance = await this.attendanceRepo.findToday(
      employeeId,
      today,
    );

    if (!photo) {
      this.badRequest('Photo is required');
    }

    if (todayAttendance) {
      this.badRequest('Already check-in today');
    }

    return this.attendanceRepo.createAttendance({
      employee_id: employeeId,
      attendance_date: today,
      check_in: new Date(),
      photo_checkin: photo,
      checkin_lat: latitude,
      checkin_long: longitude,
      status: 'CHECKED_IN',
    });
  }

  async checkOut(
    employeeId: string,
    photo: string,
    latitude: number,
    longitude: number,
  ) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAttendance = await this.attendanceRepo.findToday(
      employeeId,
      today,
    );

    if (!photo) {
      this.badRequest('Photo is required');
    }

    if (!todayAttendance) {
      this.badRequest('You have not checked in today');
    }

    if (todayAttendance.check_out) {
      this.badRequest('Already check-out');
    }

    if (!todayAttendance.check_in) {
      this.badRequest('Invalid state: check-in time is missing');
    }

    const checkoutTime = new Date();
    const workHours =
      (checkoutTime.getTime() - todayAttendance.check_in.getTime()) /
      (1000 * 60 * 60);

    await this.attendanceRepo.updateAttendance(todayAttendance.id, {
      check_out: checkoutTime,
      photo_checkout: photo,
      checkout_lat: latitude,
      checkout_long: longitude,
      status: 'CHECKED_OUT',
      work_hours: Number(workHours.toFixed(2)),
    });

    return { message: 'Checkout success' };
  }

  async autoCheckout() {
    const attendances = await this.attendanceRepo.findPendingCheckoutToday();

    for (const attendance of attendances) {
      if (!attendance.check_in) {
        continue;
      }

      const now = new Date();

      const workHours =
        (now.getTime() - attendance.check_in.getTime()) / (1000 * 60 * 60);

      await this.attendanceRepo.updateAttendance(attendance.id, {
        check_out: now,
        status: 'AUTO_CHECKOUT',
        work_hours: Number(workHours.toFixed(2)),
      });
    }
  }
}
