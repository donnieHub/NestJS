import {EntityRepository} from "@mikro-orm/postgresql";
import {Room} from "./entities/rooms.entity";

export class RoomReadRepository extends EntityRepository<Room> {

    async findById(id: string): Promise<Room | null> {
        return this.findOne({ id });
    }

}