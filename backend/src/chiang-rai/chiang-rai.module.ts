import { Module } from '@nestjs/common';
import { ChiangRaiService } from './chiang-rai.service';
import { ChiangRaiController } from './chiang-rai.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [ChiangRaiController],
  providers: [ChiangRaiService],
  exports: [ChiangRaiService],
})
export class ChiangRaiModule {}
