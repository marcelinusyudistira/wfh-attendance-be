import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { ReportsController } from './controllers/reports.controller';
import { ReportsService } from './services/reports.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ATTENDANCE_MS',
        transport: Transport.TCP,
        options: {
          host: process.env.ATTENDANCE_MS_HOST ?? '127.0.0.1',
          port: Number(process.env.ATTENDANCE_MS_PORT ?? 4002),
        },
      },
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
