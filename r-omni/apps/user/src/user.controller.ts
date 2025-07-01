import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {UserService} from "./user.service";

@Controller()
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @MessagePattern({ cmd: 'users.findAll' })
  findAll() {
    console.log('UserController findAll method called');
    return this.usersService.findAll();
  }

  @MessagePattern('users.findOne')
  findOne(@Payload() id: number) {
    console.log(`UserController findOne method called '${ this.usersService.findOne(id)}'`);
    return this.usersService.findOne(id);
  }

  @MessagePattern({ cmd: 'users.create' })
  create(@Payload() user: any) {
    return this.usersService.create(user);
  }

  @MessagePattern({ cmd: 'users.update' })
  update(@Payload() data: { id: number; user: any }) {
    return this.usersService.update(data.id, data.user);
  }

  @MessagePattern({ cmd: 'users.remove' })
  remove(@Payload() id: number) {
    return this.usersService.remove(id);
  }
}