import {Collection, Entity, EntityRepositoryType, OneToMany, PrimaryKey, Property} from '@mikro-orm/core';
import {v4} from "uuid";
import {RoomRepository} from "../room.repository";
import {Room} from "./rooms.entity";

@Entity({ tableName: 'building', repository: () => RoomRepository })
export class Building {

    [EntityRepositoryType]?: RoomRepository;

    @PrimaryKey({ type: 'uuid' })
    id: string = v4();

    @Property({ type: 'varchar', length: 100 })
    name: string;

    @Property({ type: 'varchar', length: 200, nullable: true })
    address?: string;

    @Property({ type: 'text', nullable: true  })
    description?: string;

    @OneToMany(() => Room, (room) => room.building)
    rooms = new Collection<Room>(this);

    constructor(name: string,  address?: string, description?: string) {
        this.name = name;
        this.address = address;
        this.description = description;
    }
}