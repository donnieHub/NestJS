import { Options } from '@mikro-orm/core';
import {PostgreSqlDriver} from "@mikro-orm/postgresql";
import * as path from "node:path";
import * as dotenv from 'dotenv';
import {Room} from "./src/entities/rooms.entity";
import {RoomAvailability} from "./src/entities/room.availability.entity";

dotenv.config();

export const config: Options<PostgreSqlDriver> = {
    entities: [Room, RoomAvailability],
    entitiesTs: [Room, RoomAvailability],
    dbName: process.env.DB_NAME || 'room_service_db',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.ROOM_DB_PORT || '54322', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    driver: PostgreSqlDriver,
    migrations: {
        path: path.resolve(__dirname, './src/migrations'),
        pathTs: path.resolve(__dirname, './src/migrations'),
    },
    debug: process.env.DB_DEBUG === 'true' || true,
};

export default config;