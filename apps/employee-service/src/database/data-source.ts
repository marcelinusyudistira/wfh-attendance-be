import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { Employee } from './entities/employee.entity';
import { Role } from './entities/role.entity';
import { Department } from './entities/department.entity';

import { InitEmployeeSchema1700000000000 } from './migrations/1700000000000-init-employee-schema';
import { AddDobToEmployees1700000000001 } from './migrations/1700000000001-add-dob-to-employees';

export const EmployeeDataSource = new DataSource({
  type: 'mysql',
  host: process.env.EMPLOYEE_DB_HOST,
  port: Number(process.env.EMPLOYEE_DB_PORT ?? 3306),
  username: process.env.EMPLOYEE_DB_USER,
  password: process.env.EMPLOYEE_DB_PASSWORD,
  database: process.env.EMPLOYEE_DB_NAME,
  entities: [Employee, Role, Department],
  migrations: [InitEmployeeSchema1700000000000, AddDobToEmployees1700000000001],
  synchronize: false,
});
