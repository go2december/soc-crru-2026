import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from 'db/database';
import { UploadModule } from 'upload/upload';
import { JwtStrategy } from 'shared/shared';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ProgramsModule } from './programs.module';
import { DepartmentsModule } from './departments/departments.module';
import { AdmissionsModule } from './admissions/admissions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UploadModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100, // 100 requests per minute
      },
    ]),
    ProgramsModule,
    DepartmentsModule,
    AdmissionsModule,
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class ProgramsServiceModule {}
