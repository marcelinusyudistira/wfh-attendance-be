import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ReportsService } from '../services/reports.service';
import { DashboardQueryDto } from '../dto/dashboard-query.dto';
import { FindAttendanceReportQueryDto } from '../dto/find-attendance-report-query.dto';

@Controller()
export class ReportsMicroController {
  constructor(private readonly reportsService: ReportsService) {}

  @MessagePattern('reports.dashboard')
  dashboard(@Payload() query?: DashboardQueryDto) {
    return this.reportsService.getDashboardStats(query);
  }

  @MessagePattern('reports.attendance')
  attendance(@Payload() query: FindAttendanceReportQueryDto) {
    return this.reportsService.getAttendanceReport(query);
  }
}
