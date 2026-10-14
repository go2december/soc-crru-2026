import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentServiceDto } from './create-student-service.dto';

export class UpdateStudentServiceDto extends PartialType(CreateStudentServiceDto) {}
