import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {ConfigModule} from "@nestjs/config";
import {MikroOrmModule} from "@mikro-orm/nestjs";
import {User} from "./entities/users.entity";
import {config} from "../mikro-orm.config";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./strategies/jwt.strategy";

@Module({
    imports: [
        ConfigModule.forRoot(),
        MikroOrmModule.forRoot(config),
        MikroOrmModule.forFeature({ entities: [User] }),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '24h' },
        }),
    ],
    controllers: [UserController],
    providers: [UserService, JwtStrategy],
    exports: [UserService],
})
export class UserModule {}
