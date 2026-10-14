import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from 'db/database';
import { UploadModule } from 'upload/upload';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { StaffMailService } from './mail.service';
import { PdfResumeService } from './pdf-resume.service';

@Module({
  imports: [
    DatabaseModule,
    UploadModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [StaffController],
  providers: [StaffService, StaffMailService, PdfResumeService],
  exports: [StaffService, StaffMailService, PdfResumeService],
})
export class StaffServiceModule {}
