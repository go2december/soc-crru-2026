import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AuthServiceModule } from './auth-service.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);

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

  const port = process.env.PORT ?? 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Auth Service is running on: http://localhost:${port}/api`);
}
void bootstrap();
