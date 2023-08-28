import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserDto {
  @IsNumber()
  @IsNotEmpty()
  clm_id_company: number;

  @IsNumber()
  @IsNotEmpty()
  clm_id_role: number;

  @IsNumber()
  @IsNotEmpty()
  clm_favolite_restaurant: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(120)
  clm_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(120)
  clm_username: string;

  @IsEmail()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(120)
  clm_email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(120)
  clm_password: string;
}
