import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import {ConfigModule} from "@nestjs/config";
import {MikroOrmModule} from "@mikro-orm/nestjs";
import {Room} from "../../r-omni/src/room.model";
import {config} from "../mikro-orm.config";
import {RoomAvailability} from "./entities/room.availability.entity";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MikroOrmModule.forRoot(config),
    MikroOrmModule.forFeature({ entities: [Room, RoomAvailability] }),
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
