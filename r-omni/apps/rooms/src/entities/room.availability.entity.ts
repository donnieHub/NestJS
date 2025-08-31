import {Entity, EntityRepositoryType, OneToOne, PrimaryKey, Property} from '@mikro-orm/core';
import {v4} from "uuid";
import {RoomRepository} from "../room.repository";
import {Room} from "./rooms.entity";

@Entity({ tableName: 'rooms', repository: () => RoomRepository })
export class RoomAvailability {

    [EntityRepositoryType]?: RoomRepository;

    @PrimaryKey({ type: 'uuid' })
    id: string = v4();

    @OneToOne({ type: 'uuid' })
    room_id: Room;

    @Property({ type: 'datetime' })
    date_from: Date;

    @Property({ type: 'datetime' })
    date_to: Date;

    @Property({ type: 'boolean' })
    is_booked: boolean;

    constructor(date_from: Date, date_to: Date, is_booked: boolean) {
        this.date_from = date_from;
        this.date_to = date_to;
        this.is_booked = is_booked;
    }
}