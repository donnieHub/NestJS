import {Entity, EntityRepositoryType, Enum, PrimaryKey, Property} from '@mikro-orm/core';
import {v4} from "uuid";
import {RoomRepository} from "../room.repository";
import {RoomType} from "./room.type";

@Entity({ tableName: 'rooms', repository: () => RoomRepository })
export class Room {

    [EntityRepositoryType]?: RoomRepository;

    @PrimaryKey({ type: 'uuid' })
    id: string = v4();

    @Enum({ items: () => RoomType, type: 'varchar', length: 50 })
    type: RoomType;

    @Property({ type: 'decimal' })
    price: number;

    @Property({ type: 'varchar' })
    description: string;

    @Property({ type: 'boolean' })
    is_available: boolean;

    constructor(type: RoomType, price: number, description: string, is_available: boolean) {
        this.type = type;
        this.price = price;
        this.description = description;
        this.is_available = is_available;
    }
}