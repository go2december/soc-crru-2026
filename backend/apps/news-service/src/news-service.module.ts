import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from 'db/database';
import { UploadModule } from 'upload/upload';
import { JwtStrategy } from 'shared/shared';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UploadModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [NewsController],
  providers: [NewsService, JwtStrategy],
})
export class NewsServiceModule {}
