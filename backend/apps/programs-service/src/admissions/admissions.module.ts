import { Module } from '@nestjs/common';
import { AdmissionsController } from './admissions.controller';
import { AdmissionsService } from './admissions.service';
import { DatabaseModule } from 'db/database';
import { UploadModule } from 'upload/upload';

@Module({
  imports: [DatabaseModule, UploadModule],
  controllers: [AdmissionsController],
  providers: [AdmissionsService],
})
export class AdmissionsModule {}
