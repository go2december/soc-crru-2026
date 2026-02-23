import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum DegreeLevel {
  BACHELOR = 'BACHELOR',
  MASTER = 'MASTER',
  PHD = 'PHD',
}

export class CreateProgramDto {
  @IsString()
  code: string;

  @IsString()
  name_th: string;

  @IsEnum(DegreeLevel)
  degree_level: DegreeLevel;

  @IsOptional()
  @IsString()
  description?: string;
}
