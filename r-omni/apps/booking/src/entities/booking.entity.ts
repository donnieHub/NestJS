import {
    Entity,
    EntityRepositoryType, Enum,
    PrimaryKey,
    Property
} from '@mikro-orm/core';
import {v4} from "uuid";
import {BookingRepository} from "../booking.repository";
import {BookingStatus} from "./booking.status";

@Entity({ tableName: 'bookings', repository: () => BookingRepository })
export class Booking {

    [EntityRepositoryType]?: BookingRepository;

    @PrimaryKey({ type: 'uuid' })
    id: string = v4();

    @Property({ type: 'uuid' })
    user_id: string;

    @Property({ type: 'uuid' })
    room_id: string;

    @Property({ type: 'datetime' })
    date_from: Date;

    @Property({ type: 'datetime' })
    date_to: Date;

    @Enum({ items: () => BookingStatus, type: 'varchar', length: 50 })
    status: BookingStatus;

    @Property({
        type: 'timestamp',
        defaultRaw: 'CURRENT_TIMESTAMP',
        columnType: 'timestamptz'
    })
    created_at?: Date;

    constructor(user_id: string, room_id: string, date_from: Date, date_to: Date, status: BookingStatus) {
        this.user_id = user_id;
        this.room_id = room_id;
        this.date_from = date_from;
        this.date_to = date_to;
        this.status = status;
    }
}