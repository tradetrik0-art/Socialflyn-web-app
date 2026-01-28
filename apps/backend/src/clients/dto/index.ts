import { IsString, IsArray, IsNumber, IsOptional } from 'class-validator';

export class CreateClientDto {
  @IsString()
  name: string;

  @IsString()
  industry: string;

  @IsArray()
  platforms: string[]; // ["instagram", "facebook", "linkedin"]

  @IsNumber()
  monthlyBudget: number;

  @IsOptional()
  @IsString()
  packageType?: string;
}
