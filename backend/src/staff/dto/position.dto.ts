import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreatePositionDto {
    @IsString()
    @IsNotEmpty()
    nameTh: string;

    @IsString()
    @IsOptional()
    nameEn?: string;

    @IsNumber()
    @IsOptional()
    sortOrder?: number;
}

export class UpdatePositionDto extends PartialType(CreatePositionDto) { }
