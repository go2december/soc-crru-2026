import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt, IsIn } from 'class-validator';

export class CreateStaffServiceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsIn(['HR_FINANCE', 'ACADEMIC_TEACHING', 'RESEARCH_QA', 'FACILITY_REPAIR', 'DIGITAL_IT'])
  category: 'HR_FINANCE' | 'ACADEMIC_TEACHING' | 'RESEARCH_QA' | 'FACILITY_REPAIR' | 'DIGITAL_IT';

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  badge?: string;

  @IsBoolean()
  @IsOptional()
  isExternal?: boolean;

  @IsInt()
  @IsOptional()
  displayOrder?: number;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
