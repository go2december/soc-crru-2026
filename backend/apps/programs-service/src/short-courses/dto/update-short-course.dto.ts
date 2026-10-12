import { PartialType } from '@nestjs/mapped-types';
import { CreateShortCourseDto } from './create-short-course.dto';

export class UpdateShortCourseDto extends PartialType(CreateShortCourseDto) {}
