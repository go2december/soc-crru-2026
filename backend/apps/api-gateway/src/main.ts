import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(ApiGatewayModule);

  // Enable CORS for frontend
  void app.enableCors({
    origin: true, // Allow all origins for development
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Set global prefix for API Gateway controllers (e.g. /api/upload)
  app.setGlobalPrefix('api');

  // Root route handler: redirect browsers to frontend or return API status
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get('/', (req: any, res: any) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4000';
    if (req.accepts && req.accepts('html')) {
      return res.redirect(frontendUrl);
    }
    return res.json({
      name: 'SOC-CRRU API Gateway',
      status: 'online',
      message: `This is the backend API service. For the website frontend, visit ${frontendUrl}`,
      frontendUrl,
      apiPrefix: '/api',
    });
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
  console.log(
    `🚀 SOC-CRRU Backend (Modular Monolith) is running on: http://localhost:${port}/api`,
  );
}
void bootstrap();
