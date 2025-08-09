import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {UserService} from "./user.service";
import {UserUpdate} from "./dto/user.update";
import {UserCreate} from "./dto/user.create";
import {User} from "./entities/users.entity";

@Controller()
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @MessagePattern('user.findAll')
  findAll(): Promise<User[]> {
    console.log('UserController findAll method called');
    return this.usersService.findAll();
  }

  @MessagePattern('user.findOne')
  findOne(@Payload() id: string): Promise<User | null> {
    console.log(`UserController findOne method called`);
    return this.usersService.findOne(id);
  }

  @MessagePattern('user.create')
  create(@Payload() user: UserCreate): Promise<User> {
    return this.usersService.create(user);
  }

  @MessagePattern('user.update')
  update(@Payload() user: UserUpdate): Promise<User | null> {
    console.log(`UserController update method called`);
    return this.usersService.update(user);
  }

  @MessagePattern('user.remove')
  remove(@Payload() id: string): Promise<User | null> {
    return this.usersService.remove(id);
  }
}