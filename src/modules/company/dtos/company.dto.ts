import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CompanyDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  clm_country: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(120)
  clm_company_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(15)
  clm_phone: string;

  @IsEmail()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(120)
  clm_email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(120)
  clm_address: string;
}
