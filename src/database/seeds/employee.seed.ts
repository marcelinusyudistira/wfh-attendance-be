import { DataSource } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { Department } from '../entities/department.entity';
import { Role } from '../entities/role.entity';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

export const seedEmployees = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(Employee);
  const departmentRepo = dataSource.getRepository(Department);
  const roleRepo = dataSource.getRepository(Role);

  const engineering = await departmentRepo.findOne({
    where: { department_name: 'ENGINEER' },
  });

  const hr = await departmentRepo.findOne({
    where: { department_name: 'HR' },
  });

  const adminRole = await roleRepo.findOne({
    where: { role_name: 'ADMIN' },
  });

  const employeeRole = await roleRepo.findOne({
    where: { role_name: 'EMPLOYEE' },
  });

  if (!engineering || !hr || !adminRole || !employeeRole) {
    throw new Error(
      'Department or Role not found. Run department & role seeder first.',
    );
  }

  const engineeringPositions = [
    'Associate Software Engineer',
    'Software Engineer',
    'Senior Software Engineer',
  ];

  const hrPositions = [
    'Associate Talent Acquisition',
    'Middle Talent Acquisition',
  ];

  const password = await bcrypt.hash('password123', 10);

  const employees: Partial<Employee>[] = [];

  employees.push({
    employee_code: 'EMP1001',
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password,
    department: engineering,
    position: 'Manager Software Engineer',
    role: employeeRole,
  });

  employees.push({
    employee_code: 'EMP1002',
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password,
    department: hr,
    position: 'Manager Talent Acquisition',
    role: adminRole,
  });

  for (let i = 3; i <= 15; i++) {
    const isHR = faker.datatype.boolean();

    const department = isHR ? hr : engineering;

    const position = isHR
      ? faker.helpers.arrayElement(hrPositions)
      : faker.helpers.arrayElement(engineeringPositions);

    const role = isHR
      ? faker.helpers.arrayElement([adminRole, employeeRole])
      : employeeRole;

    employees.push({
      employee_code: `EMP${1000 + i}`,
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password,
      department,
      position,
      role,
    });
  }

  await repo.save(employees);

  console.log('✅ Employees Seeded');
};
