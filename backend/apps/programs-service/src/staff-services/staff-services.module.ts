import { Module } from '@nestjs/common';
import { StaffServicesController } from './staff-services.controller';
import { StaffServicesService } from './staff-services.service';
import { DatabaseModule } from 'db/database';

@Module({
  imports: [DatabaseModule],
  controllers: [StaffServicesController],
  providers: [StaffServicesService],
  exports: [StaffServicesService],
})
export class StaffServicesModule {}
