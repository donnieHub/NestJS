import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {UserService} from "./user.service";
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
  findOne(@Payload() id: number) {
    console.log(`UserController findOne method called`);
    return this.usersService.findOne(id);
  }

  @MessagePattern('user.create')
  create(@Payload() user: any) {
    return this.usersService.create(user);
  }

  @MessagePattern('user.update')
  update(@Payload() data: { id: number; user: UserCreate }) {
    console.log(`UserController update method called`);
    return this.usersService.update(data.id, data.user);
  }

  @MessagePattern('user.remove')
  remove(@Payload() id: number) {
    return this.usersService.remove(id);
  }
}