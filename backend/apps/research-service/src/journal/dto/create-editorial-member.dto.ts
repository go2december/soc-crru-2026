import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt, IsBoolean, IsEmail } from 'class-validator';

export class CreateEditorialMemberDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  roleTitle: string;

  @IsEnum(['ADVISOR', 'EDITOR_IN_CHIEF', 'ASSOCIATE_EDITOR', 'JOURNAL_MANAGER', 'EDITORIAL_BOARD'])
  @IsNotEmpty()
  roleGroup: 'ADVISOR' | 'EDITOR_IN_CHIEF' | 'ASSOCIATE_EDITOR' | 'JOURNAL_MANAGER' | 'EDITORIAL_BOARD';

  @IsString()
  @IsOptional()
  academicTitle?: string;

  @IsString()
  @IsOptional()
  position?: string;

  @IsString()
  @IsNotEmpty()
  institution: string;

  @IsString()
  @IsOptional()
  expertise?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsInt()
  @IsOptional()
  displayOrder?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
