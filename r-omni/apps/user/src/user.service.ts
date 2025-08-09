import {Injectable} from '@nestjs/common';
import {UserUpdate} from "./dto/user.update";
import {User} from "./entities/users.entity";
import {UserCreate} from "./dto/user.create";
import {UserRepository} from "./user.repository";
import {EnsureRequestContext, EntityManager} from "@mikro-orm/postgresql";
import {RpcException} from "@nestjs/microservices";

@Injectable()
export class UserService {

  constructor(
      private readonly userRepository: UserRepository,
      private readonly em: EntityManager,
  ) {}

  @EnsureRequestContext()
  async findAll(): Promise<User[]> {
    console.log('UserService findAll method called');
    return this.userRepository.findAll();
  }

  @EnsureRequestContext()
  async findOne(id: string): Promise<User | null> {
    console.log('UserService findOne method called');
    return await this.userRepository.findOne({id});
  }

  @EnsureRequestContext()
  async create(userData: UserCreate): Promise<User> {
    const existingUser = await this.userRepository.findOne({ email: userData.email });

    if (existingUser) {
      throw new RpcException({
        statusCode: 409,
        message: 'User with this email already exists',
      });
    }

    const user = this.userRepository.create({
      email: userData.email,
      passwordHash: userData.passwordHash,
      role: userData.role || 'user',
    });
    await this.em.persistAndFlush(user);
    return user;
  }

  @EnsureRequestContext()
  async update(userData: UserUpdate): Promise<User | null> {
    console.log('UserService update method called');

    const user = await this.userRepository.findOne(userData.id);

    if (!user) {
      throw new RpcException({
        statusCode: 404,
        message: `User with id:${userData.id} not found`,
      });
    }

    this.userRepository.assign(user, userData);
    await this.em.flush();

    return user;
  }

  @EnsureRequestContext()
  async remove(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new RpcException({
        statusCode: 404,
        message: `User with id:${id} not found`,
      });
    }

    await this.em.removeAndFlush(user);
    return user;
  }
}