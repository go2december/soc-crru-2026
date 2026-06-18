import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UploadModule } from 'upload/upload';
import { UploadController } from './upload/upload.controller';
import { ProxyMiddleware } from './proxy.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Serve static files from /uploads on Port 3000
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    UploadModule,
  ],
  controllers: [UploadController],
})
export class ApiGatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply proxy middleware to all routes except upload/uploads
    consumer
      .apply(ProxyMiddleware)
      .exclude(
        { path: 'upload/(.*)', method: RequestMethod.ALL },
        { path: 'uploads/(.*)', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}
