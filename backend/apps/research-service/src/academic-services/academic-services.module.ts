import { Module } from '@nestjs/common';
import { UploadModule } from 'upload/upload';
import { AcademicServicesService } from './academic-services.service';
import { AcademicServicesController } from './academic-services.controller';

@Module({
  imports: [UploadModule],
  controllers: [AcademicServicesController],
  providers: [AcademicServicesService],
})
export class AcademicServicesModule {}
