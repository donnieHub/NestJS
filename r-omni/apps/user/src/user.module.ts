import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {ConfigModule} from "@nestjs/config";
import {MikroOrmModule} from "@mikro-orm/nestjs";
import {User} from "./entities/users.entity";
import {config} from "../mikro-orm.config";

@Module({
  imports: [
      ConfigModule.forRoot(),
      MikroOrmModule.forRoot(config),
      MikroOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
