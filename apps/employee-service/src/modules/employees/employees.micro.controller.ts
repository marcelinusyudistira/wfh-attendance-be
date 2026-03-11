import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { FindEmployeesQueryDto } from './dto/find-employees-query.dto';

@Controller()
export class EmployeesMicroController {
  constructor(private readonly employeesService: EmployeesService) {}

  @MessagePattern('employees.create')
  create(
    @Payload()
    payload: {
      dto: CreateEmployeeDto;
      actorId?: string;
    },
  ) {
    return this.employeesService.create(payload.dto, payload.actorId);
  }

  @MessagePattern('employees.findAll')
  findAll(@Payload() query?: FindEmployeesQueryDto) {
    return this.employeesService.findAll(query);
  }

  @MessagePattern('employees.findOne')
  findOne(@Payload() id: string) {
    return this.employeesService.findOne(id);
  }

  @MessagePattern('employees.update')
  update(
    @Payload()
    payload: {
      id: string;
      dto: UpdateEmployeeDto;
      actorId?: string;
    },
  ) {
    return this.employeesService.update(
      payload.id,
      payload.dto,
      payload.actorId,
    );
  }

  @MessagePattern('employees.delete')
  delete(@Payload() id: string) {
    return this.employeesService.delete(id);
  }

  @MessagePattern('employees.validateCredentials')
  validateCredentials(@Payload() payload: { email: string; password: string }) {
    return this.employeesService.validateCredentials(
      payload.email,
      payload.password,
    );
  }

  @MessagePattern('employees.changePassword')
  changePassword(
    @Payload()
    payload: {
      userId: string;
      dto: { old_password: string; new_password: string };
    },
  ) {
    return this.employeesService.changePassword(payload.userId, payload.dto);
  }

  @MessagePattern('employees.count')
  count(@Payload() payload?: { departmentId?: string }) {
    return this.employeesService.count(payload?.departmentId);
  }

  @MessagePattern('employees.findIdsByDepartment')
  findIdsByDepartment(@Payload() payload: { departmentId: string }) {
    return this.employeesService.findIdsByDepartment(payload.departmentId);
  }

  @MessagePattern('employees.searchIds')
  searchIds(@Payload() payload: { search: string }) {
    return this.employeesService.searchIds(payload.search);
  }

  @MessagePattern('employees.findLiteByIds')
  findLiteByIds(@Payload() payload: { ids: string[] }) {
    return this.employeesService.findLiteByIds(payload.ids);
  }
}
