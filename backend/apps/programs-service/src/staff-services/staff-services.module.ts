import { Module } from '@nestjs/common';
import { StaffServicesController } from './staff-services.controller';
import { StaffServicesService } from './staff-services.service';
import { DatabaseModule } from 'db/database';
import { UploadModule } from 'upload/upload';

@Module({
  imports: [DatabaseModule, UploadModule],
  controllers: [StaffServicesController],
  providers: [StaffServicesService],
  exports: [StaffServicesService],
})
export class StaffServicesModule {}
