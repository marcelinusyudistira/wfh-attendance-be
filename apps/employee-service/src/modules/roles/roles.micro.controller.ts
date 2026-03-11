import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { RolesService } from './roles.service';

@Controller()
export class RolesMicroController {
  constructor(private readonly rolesService: RolesService) {}

  @MessagePattern('roles.findAll')
  findAll() {
    return this.rolesService.findAll();
  }

  @MessagePattern('roles.findOne')
  findOne(@Payload() id: string) {
    return this.rolesService.findOne(id);
  }
}
