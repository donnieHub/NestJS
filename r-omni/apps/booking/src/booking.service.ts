import {Injectable, Logger} from '@nestjs/common';
import {EnsureRequestContext, EntityManager} from "@mikro-orm/postgresql";
import {BookingRepository} from "./booking.repository";
import {Booking} from "./entities/booking.entity";
import {BookingInput} from "./dto/booking.input";
import {BookingStatus} from "./entities/booking.status";
import {Roles} from "../../user/src/decorators/roles.decorator";
import {UserRole} from "../../user/src/entities/user.role";
import {ClientProxy, ClientProxyFactory, RpcException, Transport} from "@nestjs/microservices";
import {User} from "../../user/src/entities/users.entity";

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
  async create(bookingData: BookingInput): Promise<Booking> {
    this.logger.log(`Try to create booking with id=${bookingData.user_id}`);
    //check user exist and have enough rights
    const user: User | null = await this.natsClient.send('user.validate', { sub: bookingData.user_id }).toPromise();
    if (!user) {
      this.logger.warn(`User with id ${bookingData.user_id} not found`);

      throw new RpcException(
          {
            status: 404,
            message: 'User not found'
          }
      );
    }

    this.logger.log(`Checking room with room_id=${bookingData.room_id} free`);
    const rooms = await this.natsClient.send('user.validate', { sub: bookingData.user_id }).toPromise();
    // if (room_id exists in rooms) {

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

    //Обновление статуса номера (Rooms Service)

    return booking;
    //else { throw new RpcException({ message: `Room with room_id already booked on these dates` });}
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
