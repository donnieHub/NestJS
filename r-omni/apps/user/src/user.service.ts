import {HttpException, Injectable} from '@nestjs/common';
import {UserUpdate} from "./dto/user.update";
import {User} from "./entities/users.entity";
import {UserCreate} from "./dto/user.create";
import {UserRepository} from "./user.repository";
import {EnsureRequestContext, EntityManager} from "@mikro-orm/postgresql";

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
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new HttpException(`User with id: ${id} not found`, 401);
    }
    return user;
  }

  @EnsureRequestContext()
  async create(userData: UserCreate): Promise<User> {
    const user = this.userRepository.create({
      email: userData.email,
      passwordHash: userData.passwordHash, // В реальном приложении нужно хешировать пароль
      role: userData.role || 'user',
    });
    await this.em.persistAndFlush(user);
    return user;
  }

  @EnsureRequestContext()
  async update(id: string, userData: UserUpdate) {
    console.log('UserService update method called');

    const user = await this.userRepository.findOneOrFail(id);

    this.userRepository.assign(user, userData);
    await this.em.flush();

    return user;
  }

  @EnsureRequestContext()
  async remove(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      return null;
    }

    await this.em.removeAndFlush(user);
    return user;
  }
}