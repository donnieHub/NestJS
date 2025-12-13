import {Injectable, Logger} from '@nestjs/common';
import {EnsureRequestContext, EntityManager} from "@mikro-orm/postgresql";
import {BookingRepository} from "./booking.repository";
import {Booking} from "./entities/booking.entity";
import {BookingInput} from "./dto/booking.input";
import {BookingStatus} from "./entities/booking.status";
import {Roles} from "../../user/src/decorators/roles.decorator";
import {UserRole} from "../../user/src/entities/user.role";
import {ClientProxy, ClientProxyFactory, Transport} from "@nestjs/microservices";
import {BookingStartEvent} from "./events/booking.start.event";
import {BookingConfirmedEvent} from "./events/booking.confirmed.event";
import {BookingCancelledEvent} from "./events/booking.cancelled.event";
import {RoomWasReservedEvent} from "../../rooms/src/events/room.was.reserved.event";
import {EventBus} from "@nestjs/cqrs";
import {TimeoutService} from "./utils/timeout.service";
import {BookingTimeoutEvent} from "./events/booking.timeout.event";

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);
  private natsClient: ClientProxy;

  constructor(
      private readonly bookingRepository: BookingRepository,
      private readonly em: EntityManager,
      private readonly eventBus: EventBus,
      private readonly timeoutService: TimeoutService,
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
    const event = new BookingStartEvent(
        booking.id,
        booking.userId,
        booking.roomId,
        booking.dateFrom,
        booking.dateTo,
    );

    this.logger.log(`eventBus.publish("booking.start")`)
    this.eventBus.publish(event);

    this.logger.log(`natsClient.emit("booking.start")`)
    this.natsClient.emit('booking.start', event);

    // Запускаем таймаут (30 секунд по умолчанию)
    this.timeoutService.scheduleTimeout(booking.id, 30000);

    return booking;
  }

  @EnsureRequestContext()
  async handleRoomReserved(event: RoomWasReservedEvent): Promise<void> {
    this.logger.log(`handleRoomReserved with booking_id=${event.bookingId}`);

    // Отменяем таймаут при получении ответа
    this.timeoutService.cancelTimeout(event.bookingId);

    const booking = await this.bookingRepository.findOne(event.bookingId);

    if (!booking) {
      throw new Error(`Booking ${event.bookingId} not found`);
    }

    if (event.success) {
      // Комната успешно забронирована
      booking.status = BookingStatus.CONFIRMED;
      await this.em.flush();

      // Публикуем событие подтверждения бронирования
      const eventConfirmed = new BookingConfirmedEvent(event.bookingId);

      this.logger.log(`natsClient.emit("booking.confirmed"`);
      this.natsClient.emit(`booking.confirmed`, eventConfirmed);
    } else {
      // Не удалось забронировать комнату
      booking.status = BookingStatus.CANCELLED;
      await this.em.flush();

      const eventCanceled = new BookingCancelledEvent(event.bookingId, 'Room not available');
      this.logger.log(`natsClient.emit("booking.canceled)"`);
      this.natsClient.emit(`booking.canceled`, eventCanceled);
    }
  }

  // Обработчик таймаута если сервис room упал
  @EnsureRequestContext()
  async handleBookingTimeout(event: BookingTimeoutEvent): Promise<void> {
    this.logger.warn(`Processing timeout for booking ${event.bookingId}`);

    const booking = await this.bookingRepository.findOne(event.bookingId);
    if (!booking) return;

    if (booking.status === BookingStatus.PENDING) {
      booking.status = BookingStatus.CANCELLED;
      await this.em.flush();

      this.logger.log(`Booking ${event.bookingId} cancelled due to timeout`);

      // Отправляем событие отмены
      const eventCanceled = new BookingCancelledEvent(
          event.bookingId,
          `Reservation timeout: ${event.reason}`
      );
      this.natsClient.emit('booking.canceled', eventCanceled);
    }
  }

  @EnsureRequestContext()
  async cancelBooking(booking_id: string): Promise<void> {
    this.logger.log(`cancelBooking with booking_id=${booking_id}`);
    const booking = await this.bookingRepository.findOne(booking_id);

    if (!booking) {
      throw new Error(`Booking ${booking_id} not found`);
    }

    if (booking.status === BookingStatus.CONFIRMED) {
      // Запрос на освобождение комнаты
      this.natsClient.emit(`room.released`, {
        booking_id: booking.id,
        room_id: booking.roomId,
        date_from: booking.dateFrom,
        date_to: booking.dateTo,
      });
    }

    booking.status = BookingStatus.CANCELLED;
    await this.em.flush();

    const eventCanceled = new BookingCancelledEvent(booking_id, 'Room not available');
    this.logger.log(`natsClient.emit("booking.canceled)"`);
    this.natsClient.emit(`booking.canceled`, eventCanceled);
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
