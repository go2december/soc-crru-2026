import { Module } from '@nestjs/common';
import { AcademicServicesService } from './academic-services.service';
import { AcademicServicesController } from './academic-services.controller';

@Module({
  controllers: [AcademicServicesController],
  providers: [AcademicServicesService],
})
export class AcademicServicesModule {}
