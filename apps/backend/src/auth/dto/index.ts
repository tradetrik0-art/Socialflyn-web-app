import { IsEmail, IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsBoolean()
  isAgency?: boolean;

  @IsOptional()
  @IsString()
  role?: 'ADMIN' | 'CLIENT' | 'AGENCY_OWNER';
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
