import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from 'db/database';
import { UploadModule } from 'upload/upload';
import { ResearchModule } from './research/research.module';
import { AcademicServicesModule } from './academic-services/academic-services.module';

@Module({
  imports: [
    DatabaseModule,
    UploadModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ResearchModule,
    AcademicServicesModule,
  ],
  exports: [ResearchModule, AcademicServicesModule],
})
export class ResearchServiceModule {}
