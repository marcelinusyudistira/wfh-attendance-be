import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Department } from '../../database/entities/department.entity';

@Injectable()
export class DepartmentsRepository {
  constructor(
    @InjectRepository(Department)
    private readonly repo: Repository<Department>,
  ) {}

  findAll() {
    return this.repo.find({ order: { department_name: 'ASC' } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }
}
