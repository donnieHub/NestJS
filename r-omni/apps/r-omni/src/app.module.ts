import {Module} from '@nestjs/common';
import {join} from 'path';
import {MainController} from './mainController';
import {MainService} from './main.service';
import {AdminController} from "./admin.controller";
import {ServeStaticModule} from "@nestjs/serve-static";
import {NatsClientModule} from "./client/nats-client.module";
import {NatsClientController} from "./client/nats-client.controller";
import {NatsClientService} from "./client/nats-client.service";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot(),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../r-omni/src/public'),
        }),
        ClientsModule.register([
            {
                name: 'NATS_SERVICE',
                transport: Transport.NATS,
                options: {
                    servers: [process.env.NATS_URL ?? 'nats://nats-server:4222'],
                },
            },
        ]),
        NatsClientModule
    ],
    controllers: [
        MainController,
        AdminController,
        NatsClientController,
    ],
    providers: [MainService, NatsClientService],
})
export class AppModule {}
