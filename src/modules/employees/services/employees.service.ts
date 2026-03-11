import { Injectable, Inject } from '@nestjs/common';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { FindEmployeesQueryDto } from '../dto/find-employees-query.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

type ValidateCredentialsPayload = { email: string; password: string };
type ValidateCredentialsResult = { sub: string; email: string; role: string };

type ChangePasswordPayload = {
  userId: string;
  dto: { old_password: string; new_password: string };
};

@Injectable()
export class EmployeesService {
  constructor(
    @Inject('EMPLOYEE_MS') private readonly employeeMs: ClientProxy,
  ) {}

  create(dto: CreateEmployeeDto, actorId?: string) {
    return firstValueFrom(
      this.employeeMs.send('employees.create', { dto, actorId }),
    );
  }

  findAll(query?: FindEmployeesQueryDto) {
    return firstValueFrom(this.employeeMs.send('employees.findAll', query));
  }

  findOne(id: string) {
    return firstValueFrom(this.employeeMs.send('employees.findOne', id));
  }

  update(id: string, dto: UpdateEmployeeDto, actorId?: string) {
    return firstValueFrom(
      this.employeeMs.send('employees.update', { id, dto, actorId }),
    );
  }

  delete(id: string) {
    return firstValueFrom(this.employeeMs.send('employees.delete', id));
  }

  validateCredentials(dto: ValidateCredentialsPayload) {
    return firstValueFrom(
      this.employeeMs.send<ValidateCredentialsResult>(
        'employees.validateCredentials',
        dto,
      ),
    );
  }

  changePassword(payload: ChangePasswordPayload) {
    return firstValueFrom(
      this.employeeMs.send('employees.changePassword', payload),
    );
  }
}
