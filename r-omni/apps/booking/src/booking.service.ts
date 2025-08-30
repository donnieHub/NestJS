import {Injectable, Logger} from '@nestjs/common';
import {EnsureRequestContext, EntityManager} from "@mikro-orm/postgresql";
import {RpcException} from "@nestjs/microservices";
import {BookingRepository} from "./booking.repository";
import {Booking} from "./entities/bookings.entity";
import {BookingInput} from "./dto/booking.input";
import {BookingStatus} from "./entities/booking.status";

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
      private readonly bookingRepository: BookingRepository,
      private readonly em: EntityManager,
  ) {}

  @EnsureRequestContext()
  async findAll(): Promise<Booking[]> {
    this.logger.log('Fetching all bookings');
    return this.bookingRepository.findAll();
  }

  @EnsureRequestContext()
  async create(bookingData: BookingInput): Promise<Booking> {
    this.logger.log(`Checking room with room_id=${bookingData.room_id} free`);
    //const rooms = await this.roomsService.rooms(dateRangeInput));
    //if (room_id exists in rooms) {
    this.logger.log(`Creating booking with room_id=${bookingData.room_id}`);

    const booking = this.bookingRepository.create({
      user_id: bookingData.user_id,
      status: BookingStatus.CONFIRMED,
      room_id: bookingData.room_id,
      date_from: bookingData.date_from,
      date_to: bookingData.date_to,
    });

    await this.em.persistAndFlush(booking);

    this.logger.log(`Booking created: id=${booking.id}`);
    return booking;
    //else { throw new RpcException({ message: `Room with room_id already booked on these dates` });}
  }

  @EnsureRequestContext()
  async cancel(id: string): Promise<Booking | null> {
    this.logger.log(`Removing booking with id=${id}`);
    const booking = await this.bookingRepository.findOne(id);

    if (!booking) {
      this.logger.warn(`Booking not found for removal: id=${id}`);
      throw new RpcException({
        statusCode: 404,
        message: `Booking with id:${id} not found`,
      });
    }

    await this.em.removeAndFlush(booking);

    this.logger.log(`Booking removed: id=${id}`);
    return booking;
  }
}
