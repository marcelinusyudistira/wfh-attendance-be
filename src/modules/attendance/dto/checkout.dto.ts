import { IsNotEmpty } from 'class-validator';

export class CheckOutDto {
  @IsNotEmpty()
  latitude: number;

  @IsNotEmpty()
  longitude: number;
}
