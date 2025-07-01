import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NatsClientService } from './nats-client.service';
import {NatsClientController} from "./nats-client.controller";

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'NATS_SERVICE',
                transport: Transport.NATS,
                options: {
                    servers: ['nats://localhost:4222'],
                },
            },
        ]),
    ],
    controllers: [NatsClientController],
    providers: [NatsClientService],
    exports: [NatsClientService],
})
export class NatsClientModule {}