import { PartialType } from '@nestjs/mapped-types';
import { CreateNewsDto } from './create-news.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNewsDto extends PartialType(CreateNewsDto) {
    @IsOptional()
    @IsBoolean()
    isPublished?: boolean;
}
