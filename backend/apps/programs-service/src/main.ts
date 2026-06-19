import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ProgramsServiceModule } from './programs-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ProgramsServiceModule);

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

  const port = process.env.PORT ?? 3004;
  await app.listen(port, '0.0.0.0');
  console.log(
    `🚀 Programs Service is running on: http://localhost:${port}/api`,
  );
}
void bootstrap();
