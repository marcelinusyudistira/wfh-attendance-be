import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Attendance } from '../../database/entities/attendance.entity';
import { ReportsMicroController } from './controllers/reports.micro.controller';
import { ReportsService } from './services/reports.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance]),
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
  controllers: [ReportsMicroController],
  providers: [ReportsService],
})
export class ReportsModule {}
