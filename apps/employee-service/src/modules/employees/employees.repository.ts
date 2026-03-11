import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, Repository } from 'typeorm';

import { Employee } from '../../database/entities/employee.entity';
import { FindEmployeesQueryDto } from './dto/find-employees-query.dto';

@Injectable()
export class EmployeesRepository {
  constructor(
    @InjectRepository(Employee)
    private readonly repo: Repository<Employee>,
  ) {}

  create(data: Partial<Employee>) {
    return this.repo.save(data);
  }

  async findAll(filters?: FindEmployeesQueryDto) {
    const { page = '1', limit = '10' } = filters ?? {};
    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = Math.max(1, Number(limit) || 10);

    const qb = this.repo
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.department', 'department')
      .leftJoinAndSelect('employee.role', 'role');

    if (filters?.department_id) {
      qb.andWhere('employee.department_id = :department_id', {
        department_id: filters.department_id,
      });
    }

    if (filters?.search) {
      qb.andWhere(
        new Brackets((subQb) => {
          subQb.orWhere('employee.name LIKE :search', {
            search: `%${filters.search}%`,
          });
          subQb.orWhere('employee.email LIKE :search', {
            search: `%${filters.search}%`,
          });
          subQb.orWhere('employee.employee_code LIKE :search', {
            search: `%${filters.search}%`,
          });
        }),
      );
    }

    qb.orderBy('employee.name', 'ASC');
    qb.skip((pageNumber - 1) * limitNumber);
    qb.take(limitNumber);

    const [data, total] = await qb.getManyAndCount();

    return {
      data: data.map((e) => {
        const safe = { ...e } as unknown as { password?: string };
        delete safe.password;
        return {
          ...safe,
          department_name: e.department?.department_name ?? null,
        };
      }),
      total,
      page: pageNumber,
      limit: limitNumber,
    };
  }

  findById(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: ['department', 'role'],
    });
  }

  update(id: string, data: Partial<Employee>) {
    return this.repo.update(id, data);
  }

  delete(id: string) {
    return this.repo.delete(id);
  }

  findByEmail(email: string) {
    return this.repo.findOne({
      where: { email },
      relations: ['department', 'role'],
    });
  }

  count(departmentId?: string): Promise<number> {
    return departmentId
      ? this.repo.count({ where: { department_id: departmentId } })
      : this.repo.count();
  }

  async findIdsByDepartment(departmentId: string): Promise<string[]> {
    const rows = await this.repo
      .createQueryBuilder('employee')
      .select('employee.id', 'id')
      .where('employee.department_id = :departmentId', { departmentId })
      .getRawMany<{ id: string }>();
    return rows.map((r) => r.id);
  }

  async searchIds(search: string): Promise<string[]> {
    const rows = await this.repo
      .createQueryBuilder('employee')
      .select('employee.id', 'id')
      .where(
        new Brackets((subQb) => {
          subQb.orWhere('employee.name LIKE :search', {
            search: `%${search}%`,
          });
          subQb.orWhere('employee.employee_code LIKE :search', {
            search: `%${search}%`,
          });
        }),
      )
      .getRawMany<{ id: string }>();

    return rows.map((r) => r.id);
  }

  findLiteByIds(
    ids: string[],
  ): Promise<Array<{ id: string; name: string; employee_code: string }>> {
    if (!ids?.length) {
      return Promise.resolve([]);
    }

    return this.repo.find({
      where: { id: In(ids) },
      select: {
        id: true,
        name: true,
        employee_code: true,
      },
    });
  }
}
