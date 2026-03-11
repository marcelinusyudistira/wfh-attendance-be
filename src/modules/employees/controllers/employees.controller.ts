import {
  Controller,
  Body,
  Get,
  Post,
  UseGuards,
  Param,
  Put,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { EmployeesService } from '../services/employees.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { FindEmployeesQueryDto } from '../dto/find-employees-query.dto';
import type { JwtPayload } from '../../../common/types/jwt-payload';

type AuthRequest = { user?: JwtPayload };

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeesController {
  constructor(private readonly service: EmployeesService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateEmployeeDto, @Req() req: AuthRequest) {
    return this.service.create(dto, req.user?.sub);
  }

  @Roles('ADMIN')
  @Get()
  findAll(@Query() query: FindEmployeesQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Roles('ADMIN')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEmployeeDto,
    @Req() req: AuthRequest,
  ) {
    return this.service.update(id, dto, req.user?.sub);
  }

  @Delete(':id')
  @Roles('ADMIN')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
