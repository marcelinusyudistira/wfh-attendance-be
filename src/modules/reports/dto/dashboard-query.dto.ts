import { IsDateString, IsOptional, IsUUID } from "class-validator";

export class DashboardQueryDto {
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsUUID()
  department_id?: string;
}
