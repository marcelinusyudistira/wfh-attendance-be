import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AttendanceServiceModule } from './attendance-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AttendanceServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.ATTENDANCE_MS_HOST ?? '127.0.0.1',
        port: Number(process.env.ATTENDANCE_MS_PORT ?? 4002),
      },
    },
  );

  await app.listen();
}

void bootstrap();
