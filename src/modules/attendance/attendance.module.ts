import { Module } from '@nestjs/common';
import { AttendanceController } from './controllers/attendance.controller';
import { AttendanceService } from './services/attendance.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ATTENDANCE_MS',
        transport: Transport.TCP,
        options: {
          host: process.env.ATTENDANCE_MS_HOST ?? '127.0.0.1',
          port: Number(process.env.ATTENDANCE_MS_PORT ?? 4002),
        },
      },
    ]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
