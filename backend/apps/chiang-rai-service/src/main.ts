import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ChiangRaiServiceModule } from './chiang-rai-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ChiangRaiServiceModule);

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

  const port = process.env.PORT ?? 3003;
  await app.listen(port, '0.0.0.0');
  console.log(
    `🚀 Chiang Rai Service is running on: http://localhost:${port}/api`,
  );
}
bootstrap();
