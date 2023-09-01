import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ProviderDto {
  @IsNumber()
  @IsNotEmpty()
  clm_id_company: number;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  clm_tax_number?: string;

  @IsString()
  @MinLength(3)
  @MaxLength(120)
  clm_name: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  clm_phone?: string;

  @IsOptional()
  @IsEmail()
  @MinLength(3)
  @MaxLength(120)
  clm_email?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  clm_address?: string;
}
