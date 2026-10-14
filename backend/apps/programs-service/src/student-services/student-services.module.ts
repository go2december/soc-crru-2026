import { Module } from '@nestjs/common';
import { DatabaseModule } from 'db/database';
import { StudentServicesController } from './student-services.controller';
import { StudentServicesService } from './student-services.service';

@Module({
  imports: [DatabaseModule],
  controllers: [StudentServicesController],
  providers: [StudentServicesService],
  exports: [StudentServicesService],
})
export class StudentServicesModule {}
