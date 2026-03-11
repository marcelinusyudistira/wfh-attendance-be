import { DataSource } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { Employee } from '../entities/employee.entity';
import { faker } from '@faker-js/faker';

export const seedAttendance = async (dataSource: DataSource) => {
  const attendanceRepo = dataSource.getRepository(Attendance);
  const employeeRepo = dataSource.getRepository(Employee);

  const employees = await employeeRepo.find();

  const attendances: Attendance[] = [];

  for (const employee of employees) {
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const day = date.getDay();
      if (day === 0 || day === 6) continue;

      const status = faker.helpers.arrayElement([
        'CHECKED_OUT',
        'CHECKED_OUT',
        'CHECKED_OUT',
        'ABSENT',
        'CHECKED_IN',
      ]);

      let checkIn: Date | null = null;
      let checkOut: Date | null = null;
      let workHours: number | null = null;

      if (status !== 'ABSENT') {
        checkIn = new Date(date);
        checkIn.setHours(8 + faker.number.int({ min: 0, max: 1 }));
        checkIn.setMinutes(faker.number.int({ min: 0, max: 59 }));

        if (status === 'CHECKED_OUT') {
          checkOut = new Date(date);
          checkOut.setHours(17 + faker.number.int({ min: 0, max: 1 }));
          checkOut.setMinutes(faker.number.int({ min: 0, max: 59 }));

          workHours =
            (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
        }
      }

      attendances.push(
        attendanceRepo.create({
          employee: employee,
          employee_id: employee.id,
          attendance_date: date,
          check_in: checkIn,
          check_out: checkOut,
          work_hours: workHours,
          status,
          checkin_lat: -6.2,
          checkin_long: 106.816666,
          checkout_lat: -6.2,
          checkout_long: 106.816666,
          photo_checkin: 'checkin.jpg',
          photo_checkout: 'checkout.jpg',
        } as Partial<Attendance>),
      );
    }
  }

  await attendanceRepo.save(attendances, { chunk: 100 });

  console.log('✅ Attendance Seeded');
};
