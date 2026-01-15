import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, IsNumber } from 'class-validator';

export class CreateStaffDto {
    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @IsNumber()
    @IsNotEmpty()
    departmentId: number;

    @IsString()
    @IsOptional()
    prefixTh?: string;

    @IsString()
    @IsNotEmpty()
    firstNameTh: string;

    @IsString()
    @IsNotEmpty()
    lastNameTh: string;

    @IsString()
    @IsOptional()
    position?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    expertise?: string[];

    @IsString()
    @IsOptional()
    imageUrl?: string;

    @IsString()
    @IsOptional()
    bio?: string;
}
