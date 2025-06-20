import {Module} from '@nestjs/common';
import {join} from 'path';
import {MainController} from './mainController';
import {MainService} from './main.service';
import {ConfigModule} from "@nestjs/config";
import {AdminController} from "./admin.controller";
import {ServeStaticModule} from "@nestjs/serve-static";

@Module({
    imports: [
        ConfigModule.forRoot(), // загружает .env файл
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../src/public'),
        }),
    ],
    controllers: [
        MainController,
        AdminController,
    ],
    providers: [MainService],
})
export class AppModule {}
