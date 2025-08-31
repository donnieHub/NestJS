import {EntityRepository} from "@mikro-orm/postgresql";
import {Room} from "./entities/rooms.entity";

export class RoomRepository extends EntityRepository<Room> {

}