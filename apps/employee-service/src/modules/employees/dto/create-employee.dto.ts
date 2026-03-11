import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsNotEmpty()
  employee_code: string;

  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @ValidateIf(
    (_, value) => value !== undefined && value !== null && value !== '',
  )
  @IsString()
  @IsNotEmpty()
  password?: string;

  @IsDateString()
  @IsNotEmpty()
  dob: string;

  @IsUUID()
  @IsNotEmpty()
  department_id: string;

  @IsUUID()
  @IsNotEmpty()
  role_id: string;

  @IsNotEmpty()
  position: string;
}
