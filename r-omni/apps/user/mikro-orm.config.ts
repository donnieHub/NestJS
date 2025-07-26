import { Options } from '@mikro-orm/core';
import {PostgreSqlDriver} from "@mikro-orm/postgresql";
import {User} from "./src/entities/users.entity";

export const config: Options = {
    entities: [User],
    entitiesTs: ['./src/entities/**/*.ts'],
    dbName: process.env.DB_NAME || 'auth_service_data',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    driver: PostgreSqlDriver,
    migrations: {
        path: './src/migrations',
        pathTs: './src/migrations',
    },
    debug: true,
};

export default config;