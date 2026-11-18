import { Module } from '@nestjs/common';
import { DatabaseModule } from 'db/database';
import { UploadModule } from 'upload/upload';
import { BannersController } from './banners.controller';
import { BannersService } from './banners.service';

@Module({
  imports: [DatabaseModule, UploadModule],
  controllers: [BannersController],
  providers: [BannersService],
  exports: [BannersService],
})
export class BannersModule {}
