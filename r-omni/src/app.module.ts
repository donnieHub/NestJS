import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config";
import {AdminController} from "./admin.controller";

@Module({
  imports: [
    ConfigModule.forRoot(), // загружает .env файл
  ],
  controllers: [
      AppController,
      AdminController,
  ],
  providers: [AppService],
})
export class AppModule {}
