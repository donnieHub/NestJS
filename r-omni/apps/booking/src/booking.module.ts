import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import {ConfigModule} from "@nestjs/config";
import {MikroOrmModule} from "@mikro-orm/nestjs";
import {Booking} from "./entities/booking.entity";
import {config} from "../mikro-orm.config";

@Module({
  imports: [
      ConfigModule.forRoot(),
      MikroOrmModule.forRoot(config),
      MikroOrmModule.forFeature({ entities: [Booking] }),
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
