import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RolesService {
  constructor(@Inject('EMPLOYEE_MS') private readonly employeeMs: ClientProxy) {}

  findAll() {
    return firstValueFrom(this.employeeMs.send('roles.findAll', {}));
  }

  findOne(id: string) {
    return firstValueFrom(this.employeeMs.send('roles.findOne', id));
  }
}
