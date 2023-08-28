import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RoleDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(120)
  clm_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(120)
  clm_key: string;

  @IsString()
  @IsOptional()
  @MaxLength(120)
  clm_description?: string;

  @IsNumber()
  @IsPositive()
  clm_hierarchy: number;
}
