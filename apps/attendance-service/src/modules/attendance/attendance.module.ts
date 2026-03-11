import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Attendance } from '../../database/entities/attendance.entity';

import { AttendanceMicroController } from './controllers/attendance.micro.controller';
import { AttendanceRepository } from './repositories/attendance.repository';
import { AttendanceScheduler } from './schedulers/attendance.scheduler';
import { AttendanceService } from './services/attendance.service';

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([Attendance])],
  controllers: [AttendanceMicroController],
  providers: [AttendanceRepository, AttendanceService, AttendanceScheduler],
})
export class AttendanceModule {}
