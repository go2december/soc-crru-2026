import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from 'db/database';
import { UploadModule } from 'upload/upload';
import { ProgramsModule } from './programs.module';
import { DepartmentsModule } from './departments/departments.module';
import { AdmissionsModule } from './admissions/admissions.module';
import { ShortCoursesModule } from './short-courses/short-courses.module';
import { StudentServicesModule } from './student-services/student-services.module';
import { StaffServicesModule } from './staff-services/staff-services.module';

@Module({
  imports: [
    DatabaseModule,
    UploadModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ProgramsModule,
    DepartmentsModule,
    AdmissionsModule,
    ShortCoursesModule,
    StudentServicesModule,
    StaffServicesModule,
  ],
  exports: [
    ProgramsModule,
    DepartmentsModule,
    AdmissionsModule,
    ShortCoursesModule,
    StudentServicesModule,
    StaffServicesModule,
  ],
})
export class ProgramsServiceModule {}
