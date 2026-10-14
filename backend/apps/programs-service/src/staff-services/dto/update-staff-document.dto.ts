import { PartialType } from '@nestjs/mapped-types';
import { CreateStaffDocumentDto } from './create-staff-document.dto';

export class UpdateStaffDocumentDto extends PartialType(CreateStaffDocumentDto) {}
