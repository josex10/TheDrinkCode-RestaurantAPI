import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RestaurantDto {
  @IsNumber()
  @IsNotEmpty()
  clm_id_company: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(120)
  clm_name: string;

  @IsString()
  @MaxLength(15)
  @IsOptional()
  clm_phone?: string;

  @IsEmail()
  @MaxLength(120)
  @IsOptional()
  clm_email?: string;

  @IsString()
  @MaxLength(120)
  @IsOptional()
  clm_address?: string;
}
