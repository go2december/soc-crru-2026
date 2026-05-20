import { IsString, IsOptional, IsEnum, IsBoolean, IsDateString, MaxLength } from 'class-validator';

export class CreateAcademicServiceDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @MaxLength(50)
  serviceType: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  area?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  status?: string;

  @IsString()
  @IsOptional()
  coverImageUrl?: string;

  @IsString({ each: true })
  @IsOptional()
  galleryImages?: string[];

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsDateString()
  @IsOptional()
  publishedAt?: string;
}
