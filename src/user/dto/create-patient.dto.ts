import {
  IsString,
  IsNumber,
  IsDate,
  IsArray,
  IsOptional,
  IsEnum,
} from "class-validator";
import { Type } from "class-transformer";

export class CreatePatientDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsNumber()
  @IsOptional()
  age?: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  birthDate?: Date;

  @IsNumber()
  @IsOptional()
  pregnancyNumber?: number;

  @IsNumber()
  @IsOptional()
  gestationalAgeAtBirth?: number;

  @IsArray()
  @IsEnum(
    [
      "THA thai kỳ",
      "THA mạn tính",
      "Tiền sản giật",
      "Tiền sản giật/THA mạn tính",
    ],
    { each: true },
  )
  @IsOptional()
  pregnancyConditions?: string[];
}
