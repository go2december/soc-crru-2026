import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProcurementDocumentInputDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsNotEmpty()
  @IsEnum(['TOR', 'ANNOUNCEMENT', 'RESULT', 'CONTRACT', 'RECEIPT', 'OTHER'])
  documentType:
    'TOR' | 'ANNOUNCEMENT' | 'RESULT' | 'CONTRACT' | 'RECEIPT' | 'OTHER';

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @IsString()
  externalUrl?: string;

  @IsOptional()
  @IsString()
  originalName?: string;

  @IsOptional()
  @IsString()
  mimeType?: string;

  @IsOptional()
  @IsNumber()
  fileSize?: number;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class CreateProcurementDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  fiscalYear: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsEnum(['PRICE_CHECK', 'SPECIFIC_METHOD', 'E_BIDDING', 'E_MARKET'])
  procurementType: 'PRICE_CHECK' | 'SPECIFIC_METHOD' | 'E_BIDDING' | 'E_MARKET';

  @IsNotEmpty()
  @IsEnum(['GOODS', 'EQUIPMENT', 'CONSTRUCTION', 'SERVICE'])
  category: 'GOODS' | 'EQUIPMENT' | 'CONSTRUCTION' | 'SERVICE';

  @IsNotEmpty()
  budget: number | string;

  @IsOptional()
  contractAmount?: number | string;

  @IsOptional()
  @IsString()
  vendorName?: string;

  @IsOptional()
  approvedAt?: string | Date;

  @IsOptional()
  completedAt?: string | Date;

  @IsOptional()
  @IsEnum(['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  status?: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsString()
  createdBy?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProcurementDocumentInputDto)
  documents?: ProcurementDocumentInputDto[];
}
