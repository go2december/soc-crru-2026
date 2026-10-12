import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsUrl,
} from 'class-validator';

export class CreateShortCourseDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  instructorName?: string;

  @IsString()
  @IsOptional()
  coverImageUrl?: string;

  @IsNumber()
  @IsOptional()
  durationHours?: number;

  @IsNumber()
  @IsOptional()
  creditBankValue?: number;

  @IsBoolean()
  @IsOptional()
  isOnline?: boolean;

  @IsOptional()
  price?: string | number;

  @IsString()
  @IsOptional()
  lifelongUrl?: string;

  @IsBoolean()
  @IsOptional()
  isCreditBank?: boolean;

  @IsString()
  @IsOptional()
  status?: string;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
