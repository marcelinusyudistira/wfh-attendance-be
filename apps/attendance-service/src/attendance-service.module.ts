import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AttendanceModule } from './modules/attendance/attendance.module';
import { ReportsModule } from './modules/reports/reports.module';
import { Attendance } from './database/entities/attendance.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.ATTENDANCE_DB_HOST,
      port: Number(process.env.ATTENDANCE_DB_PORT ?? 3306),
      username: process.env.ATTENDANCE_DB_USER,
      password: process.env.ATTENDANCE_DB_PASSWORD,
      database: process.env.ATTENDANCE_DB_NAME,
      entities: [Attendance],
      synchronize: String(process.env.ATTENDANCE_DB_SYNC ?? 'false') === 'true',
    }),

    AttendanceModule,
    ReportsModule,
  ],
  controllers: [],
  providers: [],
})
export class AttendanceServiceModule {}
