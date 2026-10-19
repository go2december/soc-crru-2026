import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from 'db/database';
import { UploadModule } from 'upload/upload';
import { ChiangRaiController } from './chiang-rai.controller';
import { ChiangRaiService } from './chiang-rai.service';

@Module({
  imports: [
    DatabaseModule,
    UploadModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ChiangRaiController],
  providers: [ChiangRaiService],
  exports: [ChiangRaiService],
})
export class ChiangRaiServiceModule {}
