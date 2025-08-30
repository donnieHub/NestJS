import {Injectable, Logger} from '@nestjs/common';
import {EnsureRequestContext, EntityManager} from "@mikro-orm/postgresql";
import {RpcException} from "@nestjs/microservices";
import {BookingRepository} from "./booking.repository";
import {Booking, BookingStatus} from "./entities/bookings.entity";
import {BookingCreate} from "./dto/booking.create";

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
  async create(bookingData: BookingCreate): Promise<Booking> {
    this.logger.log(`Creating booking with room_id=${bookingData.room_id}`);
    const existingBooking = await this.bookingRepository.findOne({ room_id: bookingData.room_id });

    if (existingBooking) {
      this.logger.warn(`Booking with room_id=${bookingData.room_id} already exists`);
      throw new RpcException({
        statusCode: 409,
        message: 'Booking with this room_id already exists',
      });
    }

    const booking = this.bookingRepository.create({
      user_id: "",
      status: BookingStatus.PENDING,
      room_id: bookingData.room_id,
      date_from: bookingData.date_from,
      date_to: bookingData.date_to,
    });

    await this.em.persistAndFlush(booking);

    this.logger.log(`Booking created: id=${booking.id}`);
    return booking;
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
