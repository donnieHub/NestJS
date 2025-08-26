import { NestFactory } from '@nestjs/core';
import { BookingModule } from './booking.module';
import {Transport} from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.createMicroservice(BookingModule,
      {
        transport: Transport.NATS,
        options: {
          servers: [process.env.NATS_URL ?? 'nats://nats-server:4222'],
        },
      },);
  await app.listen();
}
bootstrap();
