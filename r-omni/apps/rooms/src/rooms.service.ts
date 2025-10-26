import {Injectable, Logger} from '@nestjs/common';
import {EnsureRequestContext, EntityManager} from "@mikro-orm/postgresql";
import {RpcException} from "@nestjs/microservices";
import {RoomRepository} from "./room.repository";
import {Room} from "./entities/rooms.entity";
import {RoomCreate} from "./dto/room.create";
import {RoomUpdate} from "./dto/room.update";

@Injectable()
export class RoomsService {
  private readonly logger = new Logger(RoomsService.name);

  constructor(
      private readonly roomRepository: RoomRepository,
      private readonly em: EntityManager,
  ) {}

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
