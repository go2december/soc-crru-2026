import { Module } from '@nestjs/common';
import { MousController } from './mous.controller';
import { MousService } from './mous.service';
import { DatabaseModule } from 'db/database';

@Module({
  imports: [DatabaseModule],
  controllers: [MousController],
  providers: [MousService],
  exports: [MousService],
})
export class MousModule {}
