import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { CreateResearchProjectDto } from './create-research-project.dto';

export class UpdateResearchProjectDto extends PartialType(CreateResearchProjectDto) {
  /** Admin can manually set a custom slug on edit. Must be lowercase alphanumeric + hyphens. */
  @IsOptional()
  @IsString()
  @MaxLength(300)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug ต้องเป็นตัวพิมพ์เล็ก a-z, 0-9 และขีดกลาง (-) เท่านั้น',
  })
  slug?: string;
}
