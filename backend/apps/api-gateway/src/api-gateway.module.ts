import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DatabaseModule } from 'db/database';
import { UploadModule } from 'upload/upload';
import { PassportModule } from '@nestjs/passport';
import { SharedModule } from 'shared/shared';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UploadController } from './upload/upload.controller';

// Domain Modules (Modular Monolith)
import { AuthServiceModule } from '../../auth-service/src/auth-service.module';
import { NewsServiceModule } from '../../news-service/src/news-service.module';
import { ChiangRaiServiceModule } from '../../chiang-rai-service/src/chiang-rai-service.module';
import { ProgramsServiceModule } from '../../programs-service/src/programs-service.module';
import { StaffServiceModule } from '../../staff-service/src/staff-service.module';
import { ResearchServiceModule } from '../../research-service/src/research-service.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    SharedModule,
    // Serve static files from /uploads on Port 3000
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    UploadModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 120, // 120 requests per minute
      },
    ]),

    // Mount all domain modules directly in-process
    AuthServiceModule,
    NewsServiceModule,
    ChiangRaiServiceModule,
    ProgramsServiceModule,
    StaffServiceModule,
    ResearchServiceModule,
  ],
  controllers: [UploadController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class ApiGatewayModule {}
