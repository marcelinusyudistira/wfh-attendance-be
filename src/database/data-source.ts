import { DataSource } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { Attendance } from './entities/attendance.entity';
import { Role } from './entities/role.entity';
import { Department } from './entities/department.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Employee, Attendance, Department, Role],
  synchronize: false,
});
