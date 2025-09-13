import {Entity, EntityRepositoryType, Enum, PrimaryKey, Property} from '@mikro-orm/core';
import {v4} from "uuid";
import {UserRepository} from "../user.repository";
import {UserRole} from "./user.role";

@Entity({ tableName: 'users', repository: () => UserRepository })
export class User {

    [EntityRepositoryType]?: UserRepository;

    @PrimaryKey({ type: 'uuid' })
    id: string = v4();

    @Property({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Property({ type: 'varchar', length: 255, hidden: true })
    passwordHash: string;

    @Enum({ items: () => UserRole, type: 'varchar', length: 50 })
    role: UserRole = UserRole.USER;

    @Property({
        type: 'timestamp',
        defaultRaw: 'CURRENT_TIMESTAMP',
        columnType: 'timestamptz'
    })
    created_at?: Date;

    constructor(email: string, passwordHash: string, role: UserRole) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
    }
}