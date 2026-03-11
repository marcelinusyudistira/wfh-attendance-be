import 'dotenv/config';
import 'reflect-metadata';

import { randomUUID } from 'node:crypto';

import { AttendanceDataSource } from '../data-source';
import { Attendance } from '../entities/attendance.entity';

async function main() {
  await AttendanceDataSource.initialize();

  const attendanceRepo = AttendanceDataSource.getRepository(Attendance);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await attendanceRepo.findOne({
    where: { employee_id: 'seed-employee', attendance_date: today },
  });

  if (!existing) {
    await attendanceRepo.save({
      id: randomUUID(),
      employee_id: 'seed-employee',
      attendance_date: today,
      check_in: new Date(),
      check_out: null,
      photo_checkin: 'seed-checkin.jpg',
      photo_checkout: null,
      status: 'CHECKED_IN',
      checkin_lat: null,
      checkin_long: null,
      checkout_lat: null,
      checkout_long: null,
      work_hours: null,
      created_at: new Date(),
    });
  }

  await AttendanceDataSource.destroy();
}

main().catch(async (err) => {
  console.error(err);
  try {
    if (AttendanceDataSource.isInitialized) {
      await AttendanceDataSource.destroy();
    }
  } catch {}
  process.exit(1);
});
