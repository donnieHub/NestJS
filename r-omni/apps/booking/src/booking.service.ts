import {Injectable, Logger} from '@nestjs/common';
import {EnsureRequestContext, EntityManager} from "@mikro-orm/postgresql";
import {BookingRepository} from "./booking.repository";
import {Booking} from "./entities/booking.entity";
import {BookingInput} from "./dto/booking.input";
import {BookingStatus} from "./entities/booking.status";
import {Roles} from "../../user/src/decorators/roles.decorator";
import {UserRole} from "../../user/src/entities/user.role";
import {ClientProxy, ClientProxyFactory, Transport} from "@nestjs/microservices";
import {BookingCreatedEvent} from "./events/booking.created.event";

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);
  private natsClient: ClientProxy;

  constructor(
      private readonly bookingRepository: BookingRepository,
      private readonly em: EntityManager,
  ) {
    this.natsClient = ClientProxyFactory.create({
      transport: Transport.NATS,
      options: { servers: ['nats://localhost:4222'] },
    });
  }

  @Roles(UserRole.ADMIN)
  @EnsureRequestContext()
  async findAll(): Promise<Booking[]> {
    this.logger.log('Fetching all bookings');
    return this.bookingRepository.findAll();
  }

  @EnsureRequestContext()
  async create(bookingData: BookingInput & { user: any }): Promise<Booking> {
    this.logger.log(`Try to create booking for user with id=${bookingData.user_id}`);
    this.logger.log(`Try to create booking for user with email=${bookingData.user.email}`);

    this.logger.log(`Checking room with room_id=${bookingData.room_id} free`);

    const booking = new Booking(
        bookingData.user_id,
        bookingData.room_id,
        bookingData.date_from,
        bookingData.date_to,
        BookingStatus.PENDING,
    );

    await this.em.persistAndFlush(booking);

    // Публикуем событие начала Saga
    const event = new BookingCreatedEvent(
        booking.id,
        booking.user_id,
        booking.room_id,
        booking.date_from,
        booking.date_to,
    );

    this.natsClient.emit('booking.start', event);

    return booking;
  }

  @EnsureRequestContext()
  async cancel(id: string): Promise<boolean> {
    this.logger.log(`Try to cancel booking with id=${id}`);

    // Проверка прав пользователя (Auth Service)

    const booking = await this.bookingRepository.findOne(id);

    if (!booking) {
      this.logger.warn(`Booking not found for cancel: id=${id}`);
      return false;
    }
    this.logger.log(`Booking with id=${id} are found in repository`);

    if (booking.status === BookingStatus.CANCELLED) {
      this.logger.warn(`Booking already canceled: id=${id}`);
      return false;
    }

    this.bookingRepository.assign(booking, { status: BookingStatus.CANCELLED });
    await this.em.flush();

    //Освобождение номера в Rooms Service

    this.logger.log(`Booking successfully canceled: id=${id}`);
    return true;
  }
}
