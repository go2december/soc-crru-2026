import { Module } from '@nestjs/common';
import { ShortCoursesService } from './short-courses.service';
import { ShortCoursesController } from './short-courses.controller';
import { DatabaseModule } from 'db/database';
import { SharedModule } from 'shared/shared';

@Module({
  imports: [DatabaseModule, SharedModule],
  controllers: [ShortCoursesController],
  providers: [ShortCoursesService],
  exports: [ShortCoursesService],
})
export class ShortCoursesModule {}
