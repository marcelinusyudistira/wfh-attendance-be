import { Injectable } from '@nestjs/common';

import { DepartmentsRepository } from './departments.repository';

@Injectable()
export class DepartmentsService {
  constructor(private readonly departmentsRepository: DepartmentsRepository) {}

  findAll() {
    return this.departmentsRepository.findAll();
  }

  findOne(id: string) {
    return this.departmentsRepository.findById(id);
  }
}
