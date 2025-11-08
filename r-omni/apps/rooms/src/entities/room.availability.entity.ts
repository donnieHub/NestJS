import {Entity, ManyToOne, PrimaryKey, Property} from '@mikro-orm/core';
import {v4} from "uuid";
import {Room} from "./rooms.entity";

@Entity({
    tableName: 'room_availability',
})
export class RoomAvailability {

    @PrimaryKey({ type: 'uuid' })
    id: string = v4();

    @ManyToOne(() => Room, { fieldName: 'room_id' })
    room: Room;

    @Property({ type: 'date' })
    date: Date;

    @Property({ type: 'boolean' })
    is_available: boolean;

    @Property({ type: 'uuid', nullable: true })
    booking_id?: string;

    constructor(room: Room, date: Date, is_available: boolean, booking_id?: string) {
        this.room = room;
        this.date = date;
        this.is_available = is_available;
        this.booking_id = booking_id;
    }
}