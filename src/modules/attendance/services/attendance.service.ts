import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AttendanceService {
  constructor(@Inject('ATTENDANCE_MS') private readonly client: ClientProxy) {}

  async checkIn(
    employeeId: string,
    photo: string,
    latitude: number,
    longitude: number,
  ) {
    return firstValueFrom(
      this.client.send('attendance.checkIn', {
        employeeId,
        photo,
        latitude,
        longitude,
      }),
    );
  }

  async checkOut(
    employeeId: string,
    photo: string,
    latitude: number,
    longitude: number,
  ) {
    return firstValueFrom(
      this.client.send('attendance.checkOut', {
        employeeId,
        photo,
        latitude,
        longitude,
      }),
    );
  }
}
