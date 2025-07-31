import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {UserService} from "./user.service";
import {UserUpdate} from "./dto/user.update";
import {UserCreate} from "./dto/user.create";

@Controller()
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @MessagePattern('user.findAll')
  findAll() {
    console.log('UserController findAll method called');
    return this.usersService.findAll();
  }

  @MessagePattern('user.findOne')
  findOne(@Payload() id: string) {
    console.log(`UserController findOne method called`);
    return this.usersService.findOne(id);
  }

  @MessagePattern('user.create')
  create(@Payload() user: UserCreate) {
    return this.usersService.create(user);
  }

  @MessagePattern('user.update')
  update(@Payload() data: { id: string; user: UserUpdate }) {
    console.log(`UserController update method called`);
    return this.usersService.update(data.id, data.user);
  }

  @MessagePattern('user.remove')
  remove(@Payload() id: string) {
    return this.usersService.remove(id);
  }
}