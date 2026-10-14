import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt, IsIn } from 'class-validator';

export class CreateStudentServiceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsIn(['ACADEMIC', 'WELFARE', 'LIBRARY', 'DIGITAL_IT', 'FACULTY'])
  category: 'ACADEMIC' | 'WELFARE' | 'LIBRARY' | 'DIGITAL_IT' | 'FACULTY';

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
