import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { AppModule } from './app.module';
import {NestExpressApplication} from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { abortOnError: false });
  app.setBaseViewsDir(join(__dirname, '../r-omni/src/views'));
  app.setViewEngine('pug');
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
