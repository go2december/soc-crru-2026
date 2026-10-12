import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateAcademicServiceConfigDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  contactEmail?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  contactPhone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  officeHours?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  officeLocation?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  responseTime?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  pdfFormUrl?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  docxFormUrl?: string;
}
