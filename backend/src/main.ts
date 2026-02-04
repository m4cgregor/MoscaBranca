import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // Allow all origins for MVP
  app.useGlobalPipes(new ValidationPipe({ transform: true })); // Validate and Transform DTOs

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
