import { IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';
import { HeartPressStatus } from '../heart-press.schema';

export class CreateHeartPressDto {
  @IsOptional()
  @IsNumber()
  diastolic?: number;

  @IsOptional()
  @IsNumber()
  systolic?: number;

  @IsOptional()
  @IsNumber()
  heartRate?: number;

}
 