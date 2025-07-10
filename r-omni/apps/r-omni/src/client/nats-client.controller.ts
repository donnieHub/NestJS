import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post} from '@nestjs/common';
import {NatsClientService} from "./nats-client.service";
import {UserCreate} from "../../../user/src/dto/user.create";
import {UserUpdate} from "../../../user/src/dto/user.update";

@Controller('user')
export class NatsClientController {
  constructor(private readonly natsClient: NatsClientService) {}

  @Get('findAll')
  async findAll() {
    const response = await this.natsClient
        .send('user.findAll', '')
        .toPromise();
    console.log(`NatsClientController: findAll method called`);

    return response;
  }

  @Get('findOne/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const response = await this.natsClient
        .send('user.findOne', id)
        .toPromise();
    console.log(`NatsClientController: findOne method called with id ${id}`);

    return response;
  }

  @Post('create')
  async create(@Body() user: UserCreate) {
    const response = await this.natsClient
        .send('user.create', user)
        .toPromise();
    console.log(`NatsClientController: findOne method called with user ${user}`);

    return response;
  }

  @Patch('update')
  async update(@Body() data: { id: number; user: UserUpdate }) {
    const response = await this.natsClient
        .send('user.update', data)
        .toPromise();
    console.log(`NatsClientController: update method called with id ${data.id} and user ${data.user}`);

    return response;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const response = await this.natsClient
        .send('user.remove', id)
        .toPromise();
    console.log(`NatsClientController: remove method called with id ${id}`);

    return response;
  }
}