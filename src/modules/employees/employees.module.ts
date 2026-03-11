import { Module } from '@nestjs/common';
import { EmployeesController } from './controllers/employees.controller';
import { EmployeesService } from './services/employees.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EMPLOYEE_MS',
        transport: Transport.TCP,
        options: {
          host: process.env.EMPLOYEE_MS_HOST ?? '127.0.0.1',
          port: Number(process.env.EMPLOYEE_MS_PORT ?? 4001),
        },
      },
    ]),
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
