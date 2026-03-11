import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Department } from '../../database/entities/department.entity';

import { DepartmentsMicroController } from './departments.micro.controller';
import { DepartmentsRepository } from './departments.repository';
import { DepartmentsService } from './departments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Department])],
  controllers: [DepartmentsMicroController],
  providers: [DepartmentsRepository, DepartmentsService],
})
export class DepartmentsModule {}
