import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  MaxLength,
  IsNumber,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export const MOU_PARTNER_TYPES = ['GOVERNMENT', 'COMMUNITY', 'ACADEMIC', 'PRIVATE'] as const;
export type MouPartnerType = (typeof MOU_PARTNER_TYPES)[number];

export class CreateMouDto {
  @IsString()
  @MaxLength(500)
  title: string;

  @IsString()
  @MaxLength(255)
  partnerName: string;

  @IsString()
  @IsIn(MOU_PARTNER_TYPES)
  partnerType: MouPartnerType;

  @IsString()
  @IsOptional()
  partnerLogoUrl?: string;

  @IsString()
  @IsOptional()
  scope?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  documentUrl?: string;

  @IsString()
  @IsOptional()
  websiteUrl?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  displayOrder?: number;
}
