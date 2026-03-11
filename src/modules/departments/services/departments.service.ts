import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DepartmentsService {
  constructor(@Inject('EMPLOYEE_MS') private readonly client: ClientProxy) {}

  findAll(): Promise<Array<{ id: string; department_name: string }>> {
    return firstValueFrom(
      this.client.send<Array<{ id: string; department_name: string }>>(
        'departments.findAll',
        {},
      ),
    );
  }

  findOne(id: string): Promise<{ id: string; department_name: string } | null> {
    return firstValueFrom(
      this.client.send<{ id: string; department_name: string } | null>(
        'departments.findOne',
        id,
      ),
    );
  }
}
