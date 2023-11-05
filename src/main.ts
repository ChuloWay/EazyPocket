import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
require('dotenv').config();
console.log('Database', process.env.MYSQL_DATABASE);
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
