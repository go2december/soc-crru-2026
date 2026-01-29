import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateNewsDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsEnum(['NEWS', 'EVENT', 'ANNOUNCE'])
    category: 'NEWS' | 'EVENT' | 'ANNOUNCE';

    @IsOptional()
    @IsUrl()
    thumbnailUrl?: string;

    @IsOptional()
    @IsString()
    authorId?: string;
}
