import {Controller, Logger, UseInterceptors} from '@nestjs/common';
import { BookingService } from './booking.service';
import {MessagePattern, Payload} from "@nestjs/microservices";
import {Booking} from "./entities/booking.entity";
import {BookingInput} from "./dto/booking.input";
import {UserAttachInterceptor} from "./intercepters/UserAttachInterceptor";

@Controller()
export class BookingController {
  private readonly logger = new Logger(BookingController.name);

  constructor(private readonly bookingService: BookingService) {}

  @MessagePattern('booking.findAll')
  findAll(): Promise<Booking[]> {
    this.logger.log('Received request: booking.findAll');
    return this.bookingService.findAll();
  }

  @UseInterceptors(UserAttachInterceptor)
  @MessagePattern('booking.create')
  create(@Payload() booking: BookingInput & { user: any }): Promise<Booking> {
    this.logger.log(`Received request: booking.create with data=${JSON.stringify(booking)}`);
    return this.bookingService.create(booking);
  }

  @MessagePattern('booking.cancel')
  cancel(@Payload() id: string): Promise<boolean> {
    this.logger.log(`Received request: booking.cancel with id=${id}`);
    return this.bookingService.cancel(id);
  }
}
