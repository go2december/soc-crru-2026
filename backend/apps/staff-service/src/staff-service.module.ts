import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from 'db/database';
import { UploadModule } from 'upload/upload';
import { JwtStrategy } from 'shared/shared';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UploadModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [StaffController],
  providers: [StaffService, JwtStrategy],
})
export class StaffServiceModule {}
