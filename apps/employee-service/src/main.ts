import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { EmployeeServiceModule } from './employee-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    EmployeeServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.EMPLOYEE_MS_HOST ?? '127.0.0.1',
        port: Number(process.env.EMPLOYEE_MS_PORT ?? 4001),
      },
    },
  );

  await app.listen();
}

void bootstrap();
