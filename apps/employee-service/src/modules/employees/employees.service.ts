import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';

import { EmployeesRepository } from './employees.repository';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { FindEmployeesQueryDto } from './dto/find-employees-query.dto';
import { Employee } from '../../database/entities/employee.entity';

@Injectable()
export class EmployeesService {
  constructor(private readonly employeesRepository: EmployeesRepository) {}

  private dobToPassword(dob: Date): string {
    const yyyy = dob.getFullYear();
    const mm = String(dob.getMonth() + 1).padStart(2, '0');
    const dd = String(dob.getDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
  }

  async create(dto: CreateEmployeeDto, actorId?: string) {
    if (!actorId) throw new RpcException('Unauthorized');

    const { dob: dobStr, password, ...rest } = dto;

    const dob = new Date(dobStr);
    if (Number.isNaN(dob.getTime())) throw new RpcException('Invalid dob');

    const rawPassword = password?.trim() || this.dobToPassword(dob);

    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const created = await this.employeesRepository.create({
      ...rest,
      password: hashedPassword,
      dob,
      created_by: actorId ?? null,
      updated_by: actorId ?? null,
    });

    const createdWithRelations = await this.employeesRepository.findById(
      created.id,
    );

    const safe = { ...(createdWithRelations ?? created) } as unknown as {
      password?: string;
    };
    delete safe.password;
    return safe;
  }

  findAll(query?: FindEmployeesQueryDto) {
    return this.employeesRepository.findAll(query);
  }

  async findOne(id: string) {
    const user = await this.employeesRepository.findById(id);
    if (!user) return null;
    const safe = { ...user } as unknown as { password?: string };
    delete safe.password;
    return safe;
  }

  async update(id: string, dto: UpdateEmployeeDto, actorId?: string) {
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    const updateData: Record<string, unknown> = {
      ...dto,
      updated_by: actorId ?? null,
    };
    if (dto.dob) {
      const dob = new Date(dto.dob);
      if (Number.isNaN(dob.getTime())) throw new RpcException('Invalid dob');
      updateData.dob = dob;
    }

    await this.employeesRepository.update(id, {
      ...(updateData as unknown as Partial<Employee>),
    });

    return this.findOne(id);
  }

  delete(id: string) {
    return this.employeesRepository.delete(id);
  }

  async validateCredentials(email: string, password: string) {
    const user = await this.employeesRepository.findByEmail(email);
    if (!user) throw new RpcException('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new RpcException('Invalid credentials');

    if (!user.role?.role_name) {
      throw new RpcException('Role is not configured for this user');
    }

    return {
      sub: user.id,
      email: user.email,
      role: user.role.role_name,
    };
  }

  async changePassword(
    userId: string,
    dto: { old_password: string; new_password: string },
  ) {
    const user = await this.employeesRepository.findById(userId);
    if (!user) throw new RpcException('Unauthorized');

    const match = await bcrypt.compare(dto.old_password, user.password);
    if (!match) throw new RpcException('Invalid old password');

    const hashedPassword = await bcrypt.hash(dto.new_password, 10);

    await this.employeesRepository.update(userId, {
      password: hashedPassword,
      updated_by: userId,
    });

    return { message: 'Password updated' };
  }

  count(departmentId?: string) {
    return this.employeesRepository.count(departmentId);
  }

  findIdsByDepartment(departmentId: string): Promise<string[]> {
    return this.employeesRepository.findIdsByDepartment(departmentId);
  }

  searchIds(search: string): Promise<string[]> {
    return this.employeesRepository.searchIds(search);
  }

  findLiteByIds(
    ids: string[],
  ): Promise<Array<{ id: string; name: string; employee_code: string }>> {
    return this.employeesRepository.findLiteByIds(ids);
  }
}
