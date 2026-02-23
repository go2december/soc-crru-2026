import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  nameTh: string;

  @IsString()
  @IsOptional()
  nameEn?: string;
}
