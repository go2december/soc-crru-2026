import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  MaxLength,
  IsArray,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AcademicServiceMemberDto {
  @IsString()
  staffId: string;

  @IsString()
  @IsOptional()
  role?: string;
}

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

  @IsString()
  @IsOptional()
  budget?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  fundingSource?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  sdgIds?: number[];

  @IsString()
  @IsOptional()
  documentUrl?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AcademicServiceMemberDto)
  @IsOptional()
  members?: AcademicServiceMemberDto[];
}
