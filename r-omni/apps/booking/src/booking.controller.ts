import {Controller, Logger} from '@nestjs/common';
import { BookingService } from './booking.service';
import {MessagePattern, Payload} from "@nestjs/microservices";
import {Booking} from "./entities/bookings.entity";
import {BookingCreate} from "./dto/booking.create";

@Controller()
export class BookingController {
  private readonly logger = new Logger(BookingController.name);

  constructor(private readonly bookingService: BookingService) {}

  @MessagePattern('booking.findAll')
  findAll(): Promise<Booking[]> {
    this.logger.log('Received request: user.findAll');
    return this.bookingService.findAll();
  }

  @MessagePattern('booking.create')
  create(@Payload() booking: BookingCreate): Promise<Booking> {
    this.logger.log(`Received request: user.create with data=${JSON.stringify(booking)}`);
    return this.bookingService.create(booking);
  }

  @MessagePattern('booking.remove')
  remove(@Payload() id: string): Promise<Booking | null> {
    this.logger.log(`Received request: user.remove with id=${id}`);
    return this.bookingService.cancel(id);
  }
}
