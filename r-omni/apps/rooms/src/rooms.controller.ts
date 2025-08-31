import {Controller, Logger} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import {MessagePattern, Payload} from "@nestjs/microservices";
import {Room} from "./entities/rooms.entity";
import {RoomCreate} from "./dto/room.create";
import {RoomUpdate} from "./dto/room.update";

@Controller()
export class RoomsController {
  private readonly logger = new Logger(RoomsController.name);

  constructor(private readonly roomService: RoomsService) {}

  @MessagePattern('room.findAll')
  findAll(): Promise<Room[]> {
    this.logger.log('Received request: room.findAll');
    return this.roomService.findAll();
  }

  @MessagePattern('room.findOne')
  findOne(@Payload() id: string): Promise<Room | null> {
    this.logger.log(`Received request: room.findOne with id=${id}`);
    return this.roomService.findOne(id);
  }

  @MessagePattern('room.create')
  create(@Payload() room: RoomCreate): Promise<Room> {
    this.logger.log(`Received request: room.create with data=${JSON.stringify(room)}`);
    return this.roomService.create(room);
  }

  @MessagePattern('room.update')
  update(@Payload() room: RoomUpdate): Promise<Room | null> {
    this.logger.log(`Received request: room.update with data=${JSON.stringify(room)}`);
    return this.roomService.update(room);
  }

  @MessagePattern('room.remove')
  remove(@Payload() id: string): Promise<Room | null> {
    this.logger.log(`Received request: room.remove with id=${id}`);
    return this.roomService.remove(id);
  }
}
