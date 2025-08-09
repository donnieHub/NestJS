import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post
} from '@nestjs/common';
import {NatsClientService} from "./nats-client.service";
import {UserCreate} from "../../../user/src/dto/user.create";
import {UserUpdate} from "../../../user/src/dto/user.update";
import {User} from "../../../user/src/entities/users.entity";

@Controller('user')
export class NatsClientController {
  constructor(private readonly natsClient: NatsClientService) {}

  @Get('findAll')
  async findAll(): Promise<User[]> {
    console.log(`NatsClientController: Before findAll method called`);
    const response = await this.natsClient
        .send('user.findAll', '')
        .toPromise();
    console.log(`NatsClientController: findAll method called`);

    return response;
  }

  @Get('findOne/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User | null> {
    const response = await this.natsClient
        .send('user.findOne', id)
        .toPromise();
    console.log(`NatsClientController: findOne method called with id ${id}`);

    return response;
  }

  @Post('create')
  async create(@Body() user: UserCreate): Promise<User | null> {
    const response = await this.natsClient.send('user.create', user).toPromise();
    console.log(`NatsClientController: create method called with user ${user}`);

    return response;
  }

  @Patch('update')
  async update(@Body() user: UserUpdate ): Promise<User | null> {
    const response = await this.natsClient
        .send('user.update', user)
        .toPromise();
    console.log(`NatsClientController: update method called with id ${user.id} and email ${user.email}`);

    return response;
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<User | null> {
    const response = await this.natsClient
        .send('user.remove', id)
        .toPromise();
    console.log(`NatsClientController: remove method called with id ${id}`);

    return response;
  }
}