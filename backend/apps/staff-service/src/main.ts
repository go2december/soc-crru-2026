import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { StaffServiceModule } from './staff-service.module';

async function bootstrap() {
  const app = await NestFactory.create(StaffServiceModule);

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Set global prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3005;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Staff Service is running on: http://localhost:${port}/api`);
}
void bootstrap();
