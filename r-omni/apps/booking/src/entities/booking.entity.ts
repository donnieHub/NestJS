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

    @PrimaryKey({ columnType: 'uuid', fieldName: 'id' })
    id: string = v4();

    @Property({ columnType: 'uuid', fieldName: 'user_id' })
    userId: string;

    @Property({ columnType: 'uuid', fieldName: 'room_id' })
    roomId: string;

    @Property({ type: 'datetime', fieldName: 'date_from' })
    dateFrom: Date;

    @Property({ type: 'datetime', fieldName: 'date_to' })
    dateTo: Date;

    @Enum({ items: () => BookingStatus, type: 'varchar', length: 50, fieldName: 'status' })
    status: BookingStatus;

    @Property({
        columnType: 'timestamptz',
        defaultRaw: 'CURRENT_TIMESTAMP',
        fieldName: 'created_at',
    })
    createdAt?: Date;

    constructor(userId: string, roomId: string, dateFrom: Date, dateTo: Date, status: BookingStatus) {
        this.userId = userId;
        this.roomId = roomId;
        this.dateFrom = dateFrom;
        this.dateTo = dateTo;
        this.status = status;
    }
}