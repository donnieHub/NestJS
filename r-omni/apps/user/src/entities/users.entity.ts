import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import {v4} from "uuid";

@Entity({ tableName: 'users' })
export class User {

    @PrimaryKey({ type: 'uuid' })
    id: string = v4();

    @Property({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Property({ type: 'varchar', length: 255, hidden: true })
    passwordHash: string;

    @Property({ type: 'varchar', length: 50 })
    role: string;

    @Property({
        type: 'timestamp',
        defaultRaw: 'CURRENT_TIMESTAMP',
        columnType: 'timestamptz'
    })
    created_at?: Date;

    constructor(email: string, passwordHash: string, role: string) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
    }
}