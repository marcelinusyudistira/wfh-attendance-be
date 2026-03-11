import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role } from '../../database/entities/role.entity';

import { RolesMicroController } from './roles.micro.controller';
import { RolesRepository } from './roles.repository';
import { RolesService } from './roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RolesMicroController],
  providers: [RolesRepository, RolesService],
})
export class RolesModule {}
