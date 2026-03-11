import { IsNotEmpty } from 'class-validator';

export class CheckInDto {
  @IsNotEmpty()
  latitude: number;

  @IsNotEmpty()
  longitude: number;
}
