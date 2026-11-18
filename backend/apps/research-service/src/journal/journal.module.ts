import { Module } from '@nestjs/common';
import { DatabaseModule } from 'db/database';
import { JournalService } from './journal.service';
import { JournalController } from './journal.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [JournalController],
  providers: [JournalService],
  exports: [JournalService],
})
export class JournalModule {}
