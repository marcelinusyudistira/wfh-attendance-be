import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AttendanceService } from '../services/attendance.service';

@Controller()
export class AttendanceMicroController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @MessagePattern('attendance.checkIn')
  checkIn(
    @Payload()
    payload: {
      employeeId: string;
      photo: string;
      latitude: number;
      longitude: number;
    },
  ) {
    return this.attendanceService.checkIn(
      payload.employeeId,
      payload.photo,
      payload.latitude,
      payload.longitude,
    );
  }

  @MessagePattern('attendance.checkOut')
  checkOut(
    @Payload()
    payload: {
      employeeId: string;
      photo: string;
      latitude: number;
      longitude: number;
    },
  ) {
    return this.attendanceService.checkOut(
      payload.employeeId,
      payload.photo,
      payload.latitude,
      payload.longitude,
    );
  }

  @MessagePattern('attendance.autoCheckout')
  autoCheckout() {
    return this.attendanceService.autoCheckout();
  }
}
