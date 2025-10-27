import {Controller, Logger} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import {MessagePattern, Payload} from "@nestjs/microservices";
import {Room} from "./entities/rooms.entity";
import {CommandBus, QueryBus} from "@nestjs/cqrs";
import {GetRoomByIdQuery} from "./queries/get.room.by.id.query";
import {BookRoomCommand} from "./commands/book.room.command";
import {GetRoomsQuery} from "./queries/get.rooms.query";
import {FindAvailableRoomsQuery} from "./queries/find.available.rooms.query";

@Controller()
export class RoomsController {
  private readonly logger = new Logger(RoomsController.name);

  constructor(
      private readonly roomService: RoomsService,
      private readonly commandBus: CommandBus,
      private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern('room.findAll')
  findAll(): Promise<Room[]> {
    this.logger.log('Received request: room.findAll');
    return this.queryBus.execute(new GetRoomsQuery())
  }

  @MessagePattern('room.findOne')
  findOne(@Payload() id: string): Promise<Room | null> {
    this.logger.log(`Received request: room.findOne with id=${id}`);
    return this.queryBus.execute(new GetRoomByIdQuery(id));
  }

  @MessagePattern('room.availableRooms')
  availableRooms(@Payload() query: FindAvailableRoomsQuery): Promise<Room[]> {
    this.logger.log(`Received request: room.availableRooms get room from ${query.startDate} to ${query.endDate}`);
    return this.queryBus.execute(new FindAvailableRoomsQuery(query.startDate, query.endDate, query.buildingId));
  }

  @MessagePattern('room.book')
  bookRoom(@Payload() id: string, is_available: boolean, from: Date, to: Date): Promise<Room | null> {
    this.logger.log(`Received request: room.book with id=${id}`);
    return this.commandBus.execute(new BookRoomCommand(id, is_available, from, to));
  }
}
