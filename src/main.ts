import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalFilter } from './common/filters/global/global.filter';
import { ValidationPipe } from '@nestjs/common';
import { winstonOptions } from './logger/logger.config';
import { WinstonModule } from 'nest-winston';
import cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonOptions),
  });
  app.use(cookieParser())
  app.setGlobalPrefix("/api/v1")
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new GlobalFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
