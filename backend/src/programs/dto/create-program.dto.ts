import { IsString, IsOptional, IsEnum, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum DegreeLevel {
  BACHELOR = 'BACHELOR',
  MASTER = 'MASTER',
  PHD = 'PHD',
}

export enum InstructorRole {
  CHAIR = 'CHAIR',
  MEMBER = 'MEMBER',
}

export class ProgramInstructorDto {
  @IsString()
  staffId: string;

  @IsEnum(InstructorRole)
  role: InstructorRole;

  @IsOptional()
  sortOrder?: number;
}

export class CreateProgramDto {
  @IsString()
  code: string;

  @IsString()
  name_th: string;

  @IsOptional()
  @IsString()
  degree_title_th?: string;

  @IsOptional()
  @IsString()
  degree_title_en?: string;

  @IsEnum(DegreeLevel)
  degree_level: DegreeLevel;

  @IsOptional()
  @IsString()
  banner_url?: string;

  @IsOptional()
  @IsString()
  curriculum_url?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  structure?: any;

  @IsOptional()
  @IsArray()
  careers?: string[];

  @IsOptional()
  @IsArray()
  highlights?: any[];

  @IsOptional()
  @IsArray()
  concentrations?: any[];

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsArray()
  gallery_images?: string[];

  @IsOptional()
  @IsArray()
  attachments?: any[];

  @IsOptional()
  @IsString()
  youtube_video_url?: string;

  @IsOptional()
  @IsString()
  facebook_video_url?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProgramInstructorDto)
  instructors?: ProgramInstructorDto[];
}
