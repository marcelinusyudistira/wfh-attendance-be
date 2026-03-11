import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ReportsService } from '../services/reports.service';
import { JwtAuthGuard } from '../../../common/guards/jwt.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { FindAttendanceReportQueryDto } from '../dto/find-attendance-report-query.dto';
import { DashboardQueryDto } from '../dto/dashboard-query.dto';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  @Roles('ADMIN')
  dashboard(@Query() query: DashboardQueryDto) {
    return this.reportsService.getDashboardStats(query);
  }

  @Get('attendance')
  @Roles('ADMIN')
  attendanceReport(@Query() query: FindAttendanceReportQueryDto) {
    return this.reportsService.getAttendanceReport(query);
  }
}
