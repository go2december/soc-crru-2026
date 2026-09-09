import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from 'db/database';
import { ChiangRaiController } from './chiang-rai.controller';
import { ChiangRaiService } from './chiang-rai.service';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ChiangRaiController],
  providers: [ChiangRaiService],
  exports: [ChiangRaiService],
})
export class ChiangRaiServiceModule {}
