import { Module } from '@nestjs/common';
import { DatabaseModule } from 'db/database';
import { UploadModule } from 'upload/upload';
import { ProcurementController } from './procurement.controller';
import { ProcurementService } from './procurement.service';

@Module({
  imports: [DatabaseModule, UploadModule],
  controllers: [ProcurementController],
  providers: [ProcurementService],
  exports: [ProcurementService],
})
export class ProcurementModule {}
