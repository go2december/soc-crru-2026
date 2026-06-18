import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ResearchServiceModule } from './research-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ResearchServiceModule);

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

  const port = process.env.PORT ?? 3006;
  await app.listen(port, '0.0.0.0');
  console.log(
    `🚀 Research & Academic Services Service is running on: http://localhost:${port}/api`,
  );
}
bootstrap();
