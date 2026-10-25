import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsArray,
} from 'class-validator';
import type {
  CoreValueItem,
  MissionItem,
  DeputyDeanItem,
  DeanOfficeUnitItem,
  StructureSection,
  StrategicPlanItem,
} from 'db/database';

export class UpdateSiteSettingsDto {
  @IsOptional()
  @IsString()
  announcementText?: string;

  @IsOptional()
  @IsString()
  announcementLink?: string;

  @IsOptional()
  @IsBoolean()
  isAnnouncementActive?: boolean;

  @IsOptional()
  @IsString()
  heroHeadlineTh?: string;

  @IsOptional()
  @IsString()
  heroSubtextTh?: string;

  @IsOptional()
  @IsInt()
  manualProgramsCount?: number | null;

  @IsOptional()
  @IsString()
  employabilityRate?: string;

  @IsOptional()
  @IsInt()
  manualPartnershipsCount?: number | null;

  @IsOptional()
  @IsString()
  lecturersRate?: string;

  @IsOptional()
  @IsString()
  communitiesCount?: string;

  @IsOptional()
  @IsInt()
  manualInnovationsCount?: number | null;

  @IsOptional()
  @IsInt()
  manualMousCount?: number | null;

  @IsOptional()
  @IsString()
  employerSatisfactionRate?: string;

  @IsOptional()
  @IsString()
  historyFoundedYear?: string;

  @IsOptional()
  @IsString()
  historyContentTh?: string;

  @IsOptional()
  @IsString()
  philosophyTh?: string;

  @IsOptional()
  @IsString()
  visionTh?: string;

  @IsOptional()
  @IsString()
  identityTh?: string;

  @IsOptional()
  @IsString()
  uniquenessTh?: string;

  @IsOptional()
  @IsArray()
  coreValues?: CoreValueItem[];

  @IsOptional()
  @IsArray()
  missions?: MissionItem[];

  @IsOptional()
  @IsArray()
  structureDeputies?: DeputyDeanItem[];

  @IsOptional()
  @IsArray()
  structureOfficeUnits?: DeanOfficeUnitItem[];

  @IsOptional()
  @IsArray()
  structureSections?: StructureSection[];

  @IsOptional()
  @IsArray()
  strategicPlans?: StrategicPlanItem[];
}
