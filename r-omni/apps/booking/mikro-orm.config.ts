import { Options } from '@mikro-orm/core';
import {PostgreSqlDriver} from "@mikro-orm/postgresql";
import * as path from "node:path";
import * as dotenv from 'dotenv';
import {Booking} from "./src/entities/booking.entity";

dotenv.config();

export const config: Options<PostgreSqlDriver> = {
    entities: [Booking],
    entitiesTs: [Booking],
    dbName: process.env.DB_NAME || 'booking_service_db',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.BOOKING_DB_PORT || '54321', 10),
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