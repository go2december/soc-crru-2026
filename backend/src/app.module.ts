import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProgramsModule } from './programs/programs.module';
import { DrizzleModule } from './drizzle/drizzle.module';
import { DepartmentsModule } from './departments/departments.module';
import { StaffModule } from './staff/staff.module';
import { AuthModule } from './auth/auth.module';
import { NewsModule } from './news/news.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DrizzleModule,
    AuthModule,
    ProgramsModule,
    DepartmentsModule,
    StaffModule,
    NewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
