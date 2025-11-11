import {ConflictException, Injectable, Logger} from '@nestjs/common';
import {EnsureRequestContext, EntityManager} from "@mikro-orm/postgresql";
import {ClientProxy, ClientProxyFactory, RpcException, Transport} from "@nestjs/microservices";
import {RoomRepository} from "./room.repository";
import {Room} from "./entities/rooms.entity";
import {RoomCreate} from "./dto/room.create";
import {RoomUpdate} from "./dto/room.update";
import {RoomReadRepository} from "./room.read.repository";
import {RoomAvailability} from "./entities/room.availability.entity";
import {RoomReservedEvent} from "./events/room.reserved.event";
import {RoomWasReservedEvent} from "./events/room.was.reserved.event";

@Injectable()
export class RoomsService {
  private readonly logger = new Logger(RoomsService.name);
  private natsClient: ClientProxy;

  constructor(
      private readonly roomRepository: RoomRepository,
      private readonly roomReadRepository: RoomReadRepository,
      private readonly em: EntityManager,
  ) {
    this.natsClient = ClientProxyFactory.create({
      transport: Transport.NATS,
      options: { servers: ['nats://localhost:4222'] },
    });
  }

  @EnsureRequestContext()
  async reserveRoom(event: RoomReservedEvent): Promise<void> {
    this.logger.log(`Reserve room with id=${event.roomId}`);

    try {
      // 1. Проверяем доступность
      const availableRooms = await this.roomReadRepository.findAvailableRooms({
        startDate: event.dateFrom,
        endDate: event.dateTo,
      });

      // 2. Если комната не найдена в доступных - бросаем ошибку
      const isRoomAvailable = availableRooms.some(room => room.id === event.roomId);

      if (!isRoomAvailable) {
        this.logger.log(`Room ${event.roomId} is not available for the selected dates`);

        const roomWasReservedEvent = new RoomWasReservedEvent(
            event.bookingId,
            event.roomId,
            false,
        );

        // Публикуем событие о том что комната НЕ была зарезервирована
        this.natsClient.emit(`room.reserved`, roomWasReservedEvent);

        throw new ConflictException(`Room ${event.roomId} is not available for the selected dates`);
      }

      // 3. Создаем записи о занятости для каждого дня периода
      await this.createRoomAvailabilityRecords(event);

      // Публикуем событие о том что комната была зарезервирована
      const roomWasReservedEvent = new RoomWasReservedEvent(
          event.bookingId,
          event.roomId,
          true,
      );

      this.logger.log(`Room was successfully reserved`);

      // Публикуем успешное событие
      this.natsClient.emit(`room.reserved`, roomWasReservedEvent);
    }  catch (error) {
      this.logger.log(`Room was not reserved because the ${error.message}`);

      const roomWasReservedEvent = new RoomWasReservedEvent(
          event.bookingId,
          event.roomId,
          false,
      );

      // Публикуем событие о том что комната НЕ была зарезервирована
      this.natsClient.emit(`room.reserved`, roomWasReservedEvent);
    }
  }

  private async createRoomAvailabilityRecords(event: RoomReservedEvent): Promise<void> {
    this.logger.log(`createRoomAvailabilityRecords with room id=${event.roomId}`);
    const room = await this.roomRepository.findOne(event.roomId);

    if (!room) {
      this.logger.log(`Room not found`);
      throw new Error('Room not found');
    }

    // Создаем записи для каждого дня в периоде
    const currentDate = new Date(event.dateFrom);
    const endDate = new Date(event.dateTo);

    while (currentDate < endDate) {
      const roomAvailability = new RoomAvailability(
          room,
          new Date(currentDate),
          false, // is_available = false
          event.bookingId
      );

      this.em.persist(roomAvailability);

      // Переходим к следующему дню
      currentDate.setDate(currentDate.getDate() + 1);
    }

    await this.em.flush();
  }

  @EnsureRequestContext()
  async create(roomData: RoomCreate): Promise<Room> {
    this.logger.log(`Creating room with description=${roomData.description}`);

    const room = this.roomRepository.create({
      type: roomData.type,
      price: roomData.price,
      description: roomData.description,
      is_available: roomData.is_available,
      building: roomData.building,
    });

    await this.em.persistAndFlush(room);

    this.logger.log(`Room created: id=${room.id}`);
    return room;
  }

  @EnsureRequestContext()
  async update(roomData: RoomUpdate): Promise<Room | null> {
    this.logger.log(`Updating room id=${roomData.id}`);
    const room = await this.roomRepository.findOne(roomData.id);

    if (!room) {
      this.logger.warn(`Room not found for update: id=${roomData.id}`);
      throw new RpcException({
        statusCode: 404,
        message: `Room with id:${roomData.id} not found`,
      });
    }

    this.roomRepository.assign(room, roomData);
    await this.em.flush();

    this.logger.log(`Room updated: id=${room.id}`);
    return room;
  }

  @EnsureRequestContext()
  async remove(id: string): Promise<Room | null> {
    this.logger.log(`Removing room id=${id}`);
    const room = await this.roomRepository.findOne(id);

    if (!room) {
      this.logger.warn(`Room not found for removal: id=${id}`);
      throw new RpcException({
        statusCode: 404,
        message: `Room with id:${id} not found`,
      });
    }

    await this.em.removeAndFlush(room);

    this.logger.log(`Room removed: id=${id}`);
    return room;
  }
}
