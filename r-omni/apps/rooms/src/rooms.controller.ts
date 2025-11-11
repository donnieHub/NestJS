import {Controller, Logger} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import {EventPattern, MessagePattern, Payload} from "@nestjs/microservices";
import {Room} from "./entities/rooms.entity";
import {CommandBus, QueryBus} from "@nestjs/cqrs";
import {GetRoomByIdQuery} from "./queries/get.room.by.id.query";
import {GetRoomsQuery} from "./queries/get.rooms.query";
import {GetAvailableRoomsQuery} from "./queries/get.available.rooms.query";
import {BookingStartEvent} from "../../booking/src/events/booking.start.event";
import {RoomReservedEvent} from "./events/room.reserved.event";

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
  availableRooms(@Payload() query: GetAvailableRoomsQuery): Promise<Room[]> {
    this.logger.log(`Received request: room.availableRooms get room from ${query.startDate} to ${query.endDate}`);
    return this.queryBus.execute(new GetAvailableRoomsQuery(query.startDate, query.endDate, query.buildingId));
  }

  // Обработчик события создания бронирования - запускает резервирование комнаты
  @EventPattern('booking.start')
  async handleBookingStart(@Payload() data: BookingStartEvent) {
    this.logger.log(`Room Service: Received booking.start event bookingId ${data.bookingId}`);
    this.logger.log(`Room Service: Received booking.start event roomId ${data.roomId}`);

    // Создаем событие для резервирования комнаты
    const reserveEvent: RoomReservedEvent = {
      bookingId: data.bookingId,
      roomId: data.roomId,
      dateFrom: data.dateFrom,
      dateTo: data.dateTo,
    };

    await this.roomService.reserveRoom(reserveEvent);
  }
}
