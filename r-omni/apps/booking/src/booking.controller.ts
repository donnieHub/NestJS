import {Controller, Logger, UseInterceptors} from '@nestjs/common';
import { BookingService } from './booking.service';
import {EventPattern, MessagePattern, Payload} from "@nestjs/microservices";
import {Booking} from "./entities/booking.entity";
import {BookingInput} from "./dto/booking.input";
import {UserAttachInterceptor} from "./intercepters/UserAttachInterceptor";
import {RoomWasReservedEvent} from "../../rooms/src/events/room.was.reserved.event";
import {BookingTimeoutEvent} from "./events/booking.timeout.event";

@Controller()
export class BookingController {
  private readonly logger = new Logger(BookingController.name);

  constructor(
      private readonly bookingService: BookingService,
  ) {}

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

  // Обработчик события подтверждения бронирования - запускает подтверждение бронирования
  @EventPattern('room.reserved')
  handleRoomReserved(@Payload() reservedEvent: RoomWasReservedEvent) {
    this.logger.log(`Received request: room.reserved with data=${JSON.stringify(reservedEvent)}`);
    this.bookingService.handleRoomReserved(reservedEvent);
  }

  @MessagePattern('booking.cancel')
  cancel(@Payload() id: string): Promise<boolean> {
    this.logger.log(`Received request: booking.cancel with id=${id}`);
    return this.bookingService.cancel(id);
  }

  @MessagePattern('booking.timeout')
  timeout(@Payload() event: BookingTimeoutEvent): Promise<void> {
    this.logger.log(`Received request: booking.timeout with bokingId=${event.bookingId} reason=${event.reason}`);
    return this.bookingService.handleBookingTimeout(event);
  }
}
