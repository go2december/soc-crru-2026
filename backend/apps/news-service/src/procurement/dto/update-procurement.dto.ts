import { PartialType } from '@nestjs/mapped-types';
import { CreateProcurementDto } from './create-procurement.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProcurementDto extends PartialType(CreateProcurementDto) {
  @IsOptional()
  @IsString()
  rejectReason?: string;
}
