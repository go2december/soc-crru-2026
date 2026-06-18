import { Module } from '@nestjs/common';
import { ResearchService } from './research.service';
import { ResearchController } from './research.controller';
import { DatabaseModule } from 'db/database';
import { UploadModule } from 'upload/upload';

@Module({
  imports: [DatabaseModule, UploadModule],
  controllers: [ResearchController],
  providers: [ResearchService],
  exports: [ResearchService],
})
export class ResearchModule {}
