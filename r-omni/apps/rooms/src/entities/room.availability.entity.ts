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

    @Property({ type: 'datetime' })
    date_from: Date;

    @Property({ type: 'datetime' })
    date_to: Date;

    @Property({ type: 'boolean' })
    is_booked: boolean;

    @Property({ type: 'uuid', nullable: true })
    booking_id: string; // Для компенсирующих действий

    constructor(date_from: Date, date_to: Date, is_booked: boolean) {
        this.date_from = date_from;
        this.date_to = date_to;
        this.is_booked = is_booked;
    }
}