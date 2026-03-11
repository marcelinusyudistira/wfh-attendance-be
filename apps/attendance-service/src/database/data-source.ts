import 'dotenv/config';
import 'reflect-metadata';

import { DataSource } from 'typeorm';

import { Attendance } from './entities/attendance.entity';
import { InitAttendanceSchema1700000000000 } from './migrations/1700000000000-init-attendance-schema';

export const AttendanceDataSource = new DataSource({
  type: 'mysql',
  host: process.env.ATTENDANCE_DB_HOST,
  port: Number(process.env.ATTENDANCE_DB_PORT ?? 3306),
  username: process.env.ATTENDANCE_DB_USER,
  password: process.env.ATTENDANCE_DB_PASSWORD,
  database: process.env.ATTENDANCE_DB_NAME,
  entities: [Attendance],
  migrations: [InitAttendanceSchema1700000000000],
});
