import { PartialType } from '@nestjs/mapped-types';
import { CreateAcademicServiceDto } from './create-academic-service.dto';

export class UpdateAcademicServiceDto extends PartialType(CreateAcademicServiceDto) {}
