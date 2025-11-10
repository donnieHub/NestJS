import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import {ConfigModule} from "@nestjs/config";
import {MikroOrmModule} from "@mikro-orm/nestjs";
import {config} from "../mikro-orm.config";
import {RoomAvailability} from "./entities/room.availability.entity";
import {Room} from "./entities/rooms.entity";
import {BookRoomHandler} from "./handlers/book.room.handler";
import {GetRoomByIdHandler} from "./handlers/get.room.by.id.handler";
import {RoomReadRepository} from "./room.read.repository";
import {CqrsModule} from "@nestjs/cqrs";
import {GetRoomsHandler} from "./handlers/get.rooms.handler";
import {GetAvailableRoomsHandler} from "./handlers/get.available.rooms.handler";
import {Building} from "./entities/building.entity";

const CommandHandlers = [
    GetRoomByIdHandler,
    GetRoomsHandler,
    BookRoomHandler,
    GetAvailableRoomsHandler,
];

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot(),
    MikroOrmModule.forRoot(config),
    MikroOrmModule.forFeature({ entities: [Room, RoomAvailability, Building] }),
  ],
  controllers: [RoomsController],
  providers: [RoomsService, RoomReadRepository, ...CommandHandlers],
})
export class RoomsModule {}
