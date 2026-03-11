import * as dotenv from 'dotenv';
dotenv.config();

import { AppDataSource } from '../data-source';
import { seedEmployees } from './employee.seed';
import { seedAttendance } from './attendance.seed';
import { seedDepartments } from './department.seed';
import { seedRoles } from './role.seed';

async function runSeed() {
  const dataSource = await AppDataSource.initialize();

  try {
    console.log('🌱 Seeding started');

    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');

    await dataSource.query('TRUNCATE TABLE attendances');
    await dataSource.query('TRUNCATE TABLE employees');
    await dataSource.query('TRUNCATE TABLE departments');
    await dataSource.query('TRUNCATE TABLE roles');

    await seedDepartments(dataSource);
    await seedRoles(dataSource);
    await seedEmployees(dataSource);
    await seedAttendance(dataSource);

    console.log('✅ Seeding finished');
  } finally {
    try {
      await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');
    } catch {}
    await dataSource.destroy();
  }
}

void runSeed().catch((err) => {
  console.error('❌ Seeding failed', err);
  process.exit(1);
});
