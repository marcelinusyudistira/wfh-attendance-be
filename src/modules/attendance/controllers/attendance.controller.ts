import {
  Controller,
  UseGuards,
  Post,
  Body,
  Req,
  UseInterceptors,
  UploadedFile,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AttendanceService } from '../services/attendance.service';
import { JwtAuthGuard } from '../../../common/guards/jwt.guard';
import { CheckInDto } from '../dto/checkin.dto';
import { CheckOutDto } from '../dto/checkout.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { attendanceMulterConfig } from '../../../upload/multer.config';
import type { JwtPayload } from '../../../common/types/jwt-payload';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @UseGuards(JwtAuthGuard)
  @Post('checkin')
  @UseInterceptors(FileInterceptor('photo', attendanceMulterConfig))
  async checkin(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CheckInDto,
    @Req() req: Request & { user?: JwtPayload },
  ) {
    const employeeId = req.user?.sub;
    if (!employeeId) throw new UnauthorizedException();

    if (!file?.filename) {
      throw new BadRequestException('Photo is required');
    }

    return this.attendanceService.checkIn(
      employeeId,
      file.filename,
      Number(body.latitude),
      Number(body.longitude),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  @UseInterceptors(FileInterceptor('photo', attendanceMulterConfig))
  async checkout(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CheckOutDto,
    @Req() req: Request & { user?: JwtPayload },
  ) {
    const employeeId = req.user?.sub;
    if (!employeeId) throw new UnauthorizedException();

    if (!file?.filename) {
      throw new BadRequestException('Photo is required');
    }

    return this.attendanceService.checkOut(
      employeeId,
      file.filename,
      Number(body.latitude),
      Number(body.longitude),
    );
  }
}
