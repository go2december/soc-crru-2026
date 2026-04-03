import { Module } from '@nestjs/common';
import { ResearchService } from './research.service';
import { ResearchController } from './research.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { AuthModule } from '../auth/auth.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [DrizzleModule, AuthModule, UploadModule],
  controllers: [ResearchController],
  providers: [ResearchService],
})
export class ResearchModule {}
