import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { AttendanceService } from '../services/attendance.service';

@Injectable()
export class AttendanceScheduler {
  private readonly logger = new Logger(AttendanceScheduler.name);

  constructor(private readonly attendanceService: AttendanceService) {}

  @Cron('0 0 23 * * *')
  async autoCheckout() {
    this.logger.log('Running auto checkout job');
    await this.attendanceService.autoCheckout();
  }
}
