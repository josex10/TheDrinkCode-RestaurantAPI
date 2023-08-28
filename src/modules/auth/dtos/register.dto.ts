import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(120)
  clm_user_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(120)
  clm_company_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  clm_country: string;

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

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(120)
  clm_restaurant_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(120)
  clm_password: string;
}
