import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ResearchProjectStatus {
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
}

export enum ResearchMemberRole {
  HEAD = 'HEAD',
  CO_RESEARCHER = 'CO_RESEARCHER',
  ADVISOR = 'ADVISOR',
  ASSISTANT = 'ASSISTANT',
  EXTERNAL_EXPERT = 'EXTERNAL_EXPERT',
}

export class CreateProjectMemberDto {
  @IsOptional()
  @IsUUID()
  staffProfileId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  externalName?: string;

  @IsEnum(ResearchMemberRole)
  role: ResearchMemberRole;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;
}

export class CreateProjectLocationDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  subDistrict?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  district?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  province?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lat?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lng?: number;
}

export class CreateResearchOutputDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  outputType?: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  journalName?: string;

  @IsOptional()
  @Type(() => Date)
  publicationDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  volume?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  issue?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  pages?: string;

  @IsOptional()
  @IsString()
  citation?: string;

  @IsOptional()
  @IsUrl({ require_tld: false }, { message: 'doiUrl must be a valid URL' })
  doiUrl?: string;

  @IsOptional()
  @IsUrl({ require_tld: false }, { message: 'tciUrl must be a valid URL' })
  tciUrl?: string;

  @IsOptional()
  @IsUrl({ require_tld: false }, { message: 'externalUrl must be a valid URL' })
  externalUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  tier?: string;
}

export class CreateResearchAttachmentDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  fileName: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  fileType?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  fileUrl: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  downloadCount?: number;
}

export class CreateResearchProjectDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  titleTh: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  titleEn?: string;

  @IsOptional()
  @IsString()
  abstractTh?: string;

  @IsOptional()
  @IsString()
  abstractEn?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(3000)
  year: number;

  @IsOptional()
  @IsNumberString()
  budget?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  fundingSource?: string;

  @IsOptional()
  @IsEnum(ResearchProjectStatus)
  status?: ResearchProjectStatus;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isSocialService?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isCommercial?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  coverImageUrl?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  keywords?: string[];

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProjectMemberDto)
  members?: CreateProjectMemberDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProjectLocationDto)
  locations?: CreateProjectLocationDto[];

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(17, { each: true })
  sdgIds?: number[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateResearchOutputDto)
  outputs?: CreateResearchOutputDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateResearchAttachmentDto)
  attachments?: CreateResearchAttachmentDto[];
}
