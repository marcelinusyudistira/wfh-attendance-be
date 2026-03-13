import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { RolesController } from './controllers/roles.controller';
import { RolesService } from './services/roles.service';

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
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
