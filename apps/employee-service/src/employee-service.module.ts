import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeesModule } from './modules/employees/employees.module';
import { RolesModule } from './modules/roles/roles.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { Employee } from './database/entities/employee.entity';
import { Role } from './database/entities/role.entity';
import { Department } from './database/entities/department.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.EMPLOYEE_DB_HOST,
      port: Number(process.env.EMPLOYEE_DB_PORT ?? 3306),
      username: process.env.EMPLOYEE_DB_USER,
      password: process.env.EMPLOYEE_DB_PASSWORD,
      database: process.env.EMPLOYEE_DB_NAME,
      entities: [Employee, Role, Department],
      synchronize: String(process.env.EMPLOYEE_DB_SYNC ?? 'false') === 'true',
    }),

    EmployeesModule,

    RolesModule,

    DepartmentsModule,
  ],
  controllers: [],
  providers: [],
})
export class EmployeeServiceModule {}
