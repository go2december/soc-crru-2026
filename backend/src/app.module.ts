import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProgramsModule } from './programs/programs.module';
import { DrizzleModule } from './drizzle/drizzle.module';
import { DepartmentsModule } from './departments/departments.module';
import { StaffModule } from './staff/staff.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DrizzleModule,
    ProgramsModule,
    DepartmentsModule,
    StaffModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
