import {
    Entity,
    EntityRepositoryType,
    ManyToOne,
    PrimaryKey,
    Property
} from '@mikro-orm/core';
import {v4} from "uuid";
import {BookingRepository} from "../booking.repository";
import {User} from "../../../user/src/entities/users.entity";

@Entity({ tableName: 'Booking', repository: () => BookingRepository })
export class Booking {

    [EntityRepositoryType]?: BookingRepository;

    @PrimaryKey({ type: 'uuid' })
    id: string = v4();

    @ManyToOne(() => User, { fieldName: 'user_id' })
    user: User;

    @Property({ type: 'uuid' })
    room_id: string;

    @Property({ type: 'datetime' })
    date_from: Date;

    @Property({ type: 'datetime' })
    date_to: Date;

    @Property({ type: 'varchar', length: 100 })
    status: string;

    @Property({
        type: 'timestamp',
        defaultRaw: 'CURRENT_TIMESTAMP',
        columnType: 'timestamptz'
    })
    created_at?: Date;

    constructor(user: User, room_id: string, date_from: Date, date_to: Date, status: string) {
        this.user = user;
        this.room_id = room_id;
        this.date_from = date_from;
        this.date_to = date_to;
        this.status = status;
    }
}