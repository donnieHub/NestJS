import {NestFactory} from "@nestjs/core";
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {UserModule} from "./user.module";

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        UserModule,
        {
            transport: Transport.NATS,
            options: {
                servers: ['nats://localhost:4222'],
            },
        },
    );

    await app.listen();
    console.log('UserService is listening');
}

bootstrap();