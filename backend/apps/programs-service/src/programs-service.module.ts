import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from 'db/database';
import { UploadModule } from 'upload/upload';
import { JwtStrategy } from 'shared/shared';
import { ProgramsModule } from './programs.module';
import { DepartmentsModule } from './departments/departments.module';
import { AdmissionsModule } from './admissions/admissions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UploadModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ProgramsModule,
    DepartmentsModule,
    AdmissionsModule,
  ],
  providers: [JwtStrategy],
})
export class ProgramsServiceModule {}
