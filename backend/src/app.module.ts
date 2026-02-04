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
import { AdminPositionsModule } from './admin-positions/admin-positions.module';

import { UploadModule } from './upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Serve static files from /uploads
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    DrizzleModule,
    AuthModule,
    ProgramsModule,
    DepartmentsModule,
    AdminPositionsModule,
    StaffModule,
    NewsModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
