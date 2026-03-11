import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Employee } from '../../database/entities/employee.entity';
import { Role } from '../../database/entities/role.entity';
import { Department } from '../../database/entities/department.entity';

import { EmployeesRepository } from './employees.repository';
import { EmployeesService } from './employees.service';
import { EmployeesMicroController } from './employees.micro.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Role, Department])],
  controllers: [EmployeesMicroController],
  providers: [EmployeesRepository, EmployeesService],
})
export class EmployeesModule {}
