import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { DepartmentsService } from './departments.service';

@Controller()
export class DepartmentsMicroController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @MessagePattern('departments.findAll')
  findAll() {
    return this.departmentsService.findAll();
  }

  @MessagePattern('departments.findOne')
  findOne(@Payload() id: string) {
    return this.departmentsService.findOne(id);
  }
}
