import 'dotenv/config';
import 'reflect-metadata';
import { randomUUID } from 'node:crypto';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

import { EmployeeDataSource } from '../data-source';
import { Role } from '../entities/role.entity';
import { Department } from '../entities/department.entity';
import { Employee } from '../entities/employee.entity';

async function main() {
  await EmployeeDataSource.initialize();

  faker.seed(Number(process.env.EMPLOYEE_SEED_FAKE_SEED ?? 20260311));

  const roleRepo = EmployeeDataSource.getRepository(Role);
  const deptRepo = EmployeeDataSource.getRepository(Department);
  const empRepo = EmployeeDataSource.getRepository(Employee);

  const adminRoleName = process.env.EMPLOYEE_SEED_ADMIN_ROLE ?? 'ADMIN';
  const employeeRoleName = process.env.EMPLOYEE_SEED_USER_ROLE ?? 'USER';

  function ymdToDate(ymd: string): Date {
    if (!/^\d{8}$/.test(ymd)) {
      throw new Error(`Invalid DOB format: ${ymd}. Expected YYYYMMDD`);
    }
    const yyyy = Number(ymd.slice(0, 4));
    const mm = Number(ymd.slice(4, 6));
    const dd = Number(ymd.slice(6, 8));
    return new Date(yyyy, mm - 1, dd);
  }

  function dobToPassword(dob: Date): string {
    const yyyy = dob.getFullYear();
    const mm = String(dob.getMonth() + 1).padStart(2, '0');
    const dd = String(dob.getDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
  }

  const departmentsToSeed = ['Engineer', 'HR', 'Marketing', 'Finance'] as const;
  const departmentMap = new Map<string, Department>();

  for (const department_name of departmentsToSeed) {
    const existing = await deptRepo.findOne({ where: { department_name } });
    const saved =
      existing ?? (await deptRepo.save({ id: randomUUID(), department_name }));
    departmentMap.set(department_name, saved);
  }

  const rolesToSeed = [adminRoleName, employeeRoleName];
  const roleMap = new Map<string, Role>();
  for (const role_name of rolesToSeed) {
    const existing = await roleRepo.findOne({ where: { role_name } });
    const saved =
      existing ?? (await roleRepo.save({ id: randomUUID(), role_name }));
    roleMap.set(role_name, saved);
  }

  const deptEngineer = departmentMap.get('Engineer');
  const deptHr = departmentMap.get('HR');
  if (!deptEngineer || !deptHr) {
    throw new Error('Required departments were not created');
  }

  const roleAdmin = roleMap.get(adminRoleName);
  const roleEmployee = roleMap.get(employeeRoleName);
  if (!roleAdmin || !roleEmployee) {
    throw new Error('Required roles were not created');
  }

  const employeesToSeed: Array<{
    email: string;
    employee_code: string;
    dob_ymd: string;
    department: 'Engineer' | 'HR';
    role: 'ADMIN' | 'EMPLOYEE';
    position:
      | 'Associate Software Engineer'
      | 'Software Engineer'
      | 'Senior Software Engineer'
      | 'Talent Aquisition'
      | 'Senior Talent Aquisition';
  }> = [
    {
      email: 'hr.senior.ta01@local.test',
      employee_code: 'HR-0001',
      dob_ymd: '19900101',
      department: 'HR',
      role: 'ADMIN',
      position: 'Senior Talent Aquisition',
    },
    {
      email: 'hr.senior.ta02@local.test',
      employee_code: 'HR-0002',
      dob_ymd: '19900202',
      department: 'HR',
      role: 'ADMIN',
      position: 'Senior Talent Aquisition',
    },
    {
      email: 'hr.senior.ta03@local.test',
      employee_code: 'HR-0003',
      dob_ymd: '19900303',
      department: 'HR',
      role: 'ADMIN',
      position: 'Senior Talent Aquisition',
    },
    {
      email: 'hr.ta01@local.test',
      employee_code: 'HR-0004',
      dob_ymd: '19910404',
      department: 'HR',
      role: 'EMPLOYEE',
      position: 'Talent Aquisition',
    },
    {
      email: 'hr.ta02@local.test',
      employee_code: 'HR-0005',
      dob_ymd: '19910505',
      department: 'HR',
      role: 'EMPLOYEE',
      position: 'Talent Aquisition',
    },
    {
      email: 'eng.01@local.test',
      employee_code: 'ENG-0001',
      dob_ymd: '19970101',
      department: 'Engineer',
      role: 'EMPLOYEE',
      position: 'Associate Software Engineer',
    },
    {
      email: 'eng.02@local.test',
      employee_code: 'ENG-0002',
      dob_ymd: '19970202',
      department: 'Engineer',
      role: 'EMPLOYEE',
      position: 'Associate Software Engineer',
    },
    {
      email: 'eng.03@local.test',
      employee_code: 'ENG-0003',
      dob_ymd: '19970303',
      department: 'Engineer',
      role: 'EMPLOYEE',
      position: 'Associate Software Engineer',
    },
    {
      email: 'eng.04@local.test',
      employee_code: 'ENG-0004',
      dob_ymd: '19970404',
      department: 'Engineer',
      role: 'EMPLOYEE',
      position: 'Associate Software Engineer',
    },
    {
      email: 'eng.05@local.test',
      employee_code: 'ENG-0005',
      dob_ymd: '19970505',
      department: 'Engineer',
      role: 'EMPLOYEE',
      position: 'Software Engineer',
    },
    {
      email: 'eng.06@local.test',
      employee_code: 'ENG-0006',
      dob_ymd: '19970606',
      department: 'Engineer',
      role: 'EMPLOYEE',
      position: 'Software Engineer',
    },
    {
      email: 'eng.07@local.test',
      employee_code: 'ENG-0007',
      dob_ymd: '19970707',
      department: 'Engineer',
      role: 'EMPLOYEE',
      position: 'Software Engineer',
    },
    {
      email: 'eng.08@local.test',
      employee_code: 'ENG-0008',
      dob_ymd: '19970808',
      department: 'Engineer',
      role: 'EMPLOYEE',
      position: 'Software Engineer',
    },
    {
      email: 'eng.09@local.test',
      employee_code: 'ENG-0009',
      dob_ymd: '19970909',
      department: 'Engineer',
      role: 'EMPLOYEE',
      position: 'Senior Software Engineer',
    },
    {
      email: 'eng.10@local.test',
      employee_code: 'ENG-0010',
      dob_ymd: '19971010',
      department: 'Engineer',
      role: 'EMPLOYEE',
      position: 'Senior Software Engineer',
    },
  ];

  console.log('\nSeed credentials (password = DOB YYYYMMDD):');
  for (const item of employeesToSeed) {
    console.log(
      `- ${item.email} | dob=${item.dob_ymd} | password=${item.dob_ymd}`,
    );
  }

  for (const item of employeesToSeed) {
    const existing = await empRepo.findOne({ where: { email: item.email } });
    const dob = ymdToDate(item.dob_ymd);
    const rawPassword = dobToPassword(dob);
    const hashed = await bcrypt.hash(rawPassword, 10);
    const name = existing?.name ?? faker.person.fullName();

    const department_id =
      item.department === 'Engineer' ? deptEngineer.id : deptHr.id;
    const role_id = item.role === 'ADMIN' ? roleAdmin.id : roleEmployee.id;

    if (existing) {
      await empRepo.save({
        ...existing,
        employee_code: item.employee_code,
        name,
        password: hashed,
        dob,
        department_id,
        role_id,
        position: item.position,
        updated_by: existing.updated_by ?? null,
      });
      continue;
    }

    await empRepo.save({
      id: randomUUID(),
      employee_code: item.employee_code,
      name,
      email: item.email,
      password: hashed,
      dob,
      department_id,
      role_id,
      position: item.position,
      created_by: null,
      updated_by: null,
    });
  }

  await EmployeeDataSource.destroy();
}

main().catch(async (err) => {
  console.error(err);
  try {
    if (EmployeeDataSource.isInitialized) {
      await EmployeeDataSource.destroy();
    }
  } catch {}
  process.exit(1);
});
