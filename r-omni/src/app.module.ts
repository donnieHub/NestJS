import {Module} from '@nestjs/common';
import {join} from 'path';
import {AppController} from './app.controller';
import {AppService} from './app.service';
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
        AppController,
        AdminController,
    ],
    providers: [AppService],
})
export class AppModule {}
