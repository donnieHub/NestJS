import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import {ConfigModule} from "@nestjs/config";
import {MikroOrmModule} from "@mikro-orm/nestjs";
import {Booking} from "./entities/booking.entity";
import {config} from "../mikro-orm.config";
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
  imports: [
      ConfigModule.forRoot(),
      MikroOrmModule.forRoot(config),
      MikroOrmModule.forFeature({ entities: [Booking] }),
      ClientsModule.register([
          {
              name: 'BOOKING_SERVICE', // ключ провайдера
              transport: Transport.NATS,
              options: { servers: ['nats://localhost:4222'] },
          },
      ]),
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
