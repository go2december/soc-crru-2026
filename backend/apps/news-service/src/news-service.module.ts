import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from 'db/database';
import { UploadModule } from 'upload/upload';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { ProcurementModule } from './procurement/procurement.module';

@Module({
  imports: [
    DatabaseModule,
    UploadModule,
    ProcurementModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsServiceModule {}
