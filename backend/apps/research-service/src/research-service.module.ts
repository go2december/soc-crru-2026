import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from 'db/database';
import { UploadModule } from 'upload/upload';
import { JwtStrategy } from 'shared/shared';
import { ResearchModule } from './research/research.module';
import { AcademicServicesModule } from './academic-services/academic-services.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UploadModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ResearchModule,
    AcademicServicesModule,
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class ResearchServiceModule {}
