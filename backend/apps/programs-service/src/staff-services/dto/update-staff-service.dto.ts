import { PartialType } from '@nestjs/mapped-types';
import { CreateStaffServiceDto } from './create-staff-service.dto';

export class UpdateStaffServiceDto extends PartialType(CreateStaffServiceDto) {}
