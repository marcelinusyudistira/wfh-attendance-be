import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from '../../database/entities/role.entity';

@Injectable()
export class RolesRepository {
  constructor(
    @InjectRepository(Role)
    private readonly repo: Repository<Role>,
  ) {}

  findAll() {
    return this.repo.find({ order: { role_name: 'ASC' } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }
}
