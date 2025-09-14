import {Controller, Logger} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {UserService} from "./user.service";
import {UserUpdate} from "./dto/user.update";
import {UserCreate} from "./dto/user.create";
import {User} from "./entities/users.entity";
import {LoginInput} from "./dto/login.input";
import {RegisterInput} from "./dto/register.input";
import {AuthPayload} from "../../bff/src/model/auth.payload";

@Controller()
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly usersService: UserService) {}

  @MessagePattern('user.login')
  login(@Payload() loginInput: LoginInput): Promise<AuthPayload> {
    this.logger.log('Received request: user.login');
    return this.usersService.login(loginInput);
  }

  @MessagePattern('user.register')
  register(@Payload() registerInput: RegisterInput): Promise<User> {
    this.logger.log('Received request: user.register');
    return this.usersService.register(registerInput);
  }

  @MessagePattern('user.findAll')
  findAll(): Promise<User[]> {
    this.logger.log('Received request: user.findAll');
    return this.usersService.findAll();
  }

  @MessagePattern('user.findOne')
  findOne(@Payload() id: string): Promise<User | null> {
    this.logger.log(`Received request: user.findOne with id=${id}`);
    return this.usersService.findOne(id);
  }

  @MessagePattern('user.create')
  create(@Payload() user: UserCreate): Promise<User> {
    this.logger.log(`Received request: user.create with data=${JSON.stringify(user)}`);
    return this.usersService.create(user);
  }

  @MessagePattern('user.update')
  update(@Payload() user: UserUpdate): Promise<User | null> {
    this.logger.log(`Received request: user.update with data=${JSON.stringify(user)}`);
    return this.usersService.update(user);
  }

  @MessagePattern('user.remove')
  remove(@Payload() id: string): Promise<User | null> {
    this.logger.log(`Received request: user.remove with id=${id}`);
    return this.usersService.remove(id);
  }
}