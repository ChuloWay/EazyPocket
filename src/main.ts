import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(new ValidationPipe());
  app.use(morgan('tiny'));
  app.setGlobalPrefix('api/v1');
  await app
    .listen(process.env.PORT || 2023)
    .then(() => logger.log(`EazyPocket API is listening on: port:${process.env.PORT}`))
    .catch((err) => {
      logger.error('>>> App error: ', err);
    });
}
bootstrap();
