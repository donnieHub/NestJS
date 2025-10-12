import {Injectable, Logger} from '@nestjs/common';
import {UserUpdate} from "./dto/user.update";
import {User} from "./entities/users.entity";
import {UserCreate} from "./dto/user.create";
import {UserRepository} from "./user.repository";
import {EnsureRequestContext, EntityManager} from "@mikro-orm/postgresql";
import {RpcException} from "@nestjs/microservices";
import {compare, hash} from 'bcrypt';
import {UserRole} from "./entities/user.role";
import {JwtService} from "@nestjs/jwt";
import {RegisterInput} from "./dto/register.input";
import {LoginInput} from "./dto/login.input";
import {AuthPayload} from "../../bff/src/model/auth.payload";
import {UserModel} from "../../bff/src/model/user.model";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
      private readonly userRepository: UserRepository,
      private readonly em: EntityManager,
      private readonly jwtService: JwtService,
  ) {}

  @EnsureRequestContext()
  async register(registerInput: RegisterInput): Promise<any> {
    const { email, password } = registerInput;

    const existingUser = await this.em.findOne(User, { email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await hash(password, 10);
    const user = this.em.create(User, {
      email,
      passwordHash: hashedPassword,
      role: UserRole.USER,
    });

    await this.em.persistAndFlush(user);

    const token = this.generateToken(user);
    return { token, user };
  }

  @EnsureRequestContext()
  async login(loginInput: LoginInput): Promise<AuthPayload> {
    this.logger.log(`Try to login as user with email=${loginInput.email}`);
    const { email, password } = loginInput;

    const user: User | null = await this.em.findOne(User, { email });
    if (!user || !(await compare(password, user.passwordHash))) {
      this.logger.log(`Throw UnauthorizedException`);
      throw new RpcException(
          {
            status: 401,
            message: 'Invalid credentials'
          }
      );
    }

    const userModel: UserModel = {
      id: user.id,
      email: user.email,
      role: user.role,
      created_at: user.created_at
    };

    const token = await this.generateToken(user);
    this.logger.log(`Token was generated for user with email=${user.email}`);

    return {
      token: token,
      user: userModel,
    };
  }

  @EnsureRequestContext()
  private async generateToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role
    };

    return this.jwtService.sign(payload);
  }

  @EnsureRequestContext()
  async validateUser(payload: any): Promise<User | null> {
    this.logger.log(`Validate user by id=${payload.sub}`);
    return await this.em.findOne(User, { id: payload.sub });
  }

  @EnsureRequestContext()
  async findAll(): Promise<User[]> {
    this.logger.log('Fetching all users');
    return this.userRepository.findAll();
  }

  @EnsureRequestContext()
  async findOne(id: string): Promise<User | null> {
    this.logger.log(`Fetching user by id=${id}`);
    return await this.userRepository.findOne({id});
  }

  @EnsureRequestContext()
  async create(userData: UserCreate): Promise<User> {
    this.logger.log(`Creating user with email=${userData.email}`);
    const saltRounds = 10;
    const passwordHash = await hash(userData.password, saltRounds);
    const existingUser = await this.userRepository.findOne({ email: userData.email });

    if (existingUser) {
      this.logger.warn(`User with email=${userData.email} already exists`);
      throw new RpcException({
        statusCode: 409,
        message: 'User with this email already exists',
      });
    }

    const user = this.userRepository.create({
      email: userData.email,
      passwordHash: passwordHash,
      role: userData.role || UserRole.USER,
    });

    await this.em.persistAndFlush(user);

    this.logger.log(`User created: id=${user.id}, email=${user.email}`);
    return user;
  }

  @EnsureRequestContext()
  async update(userData: UserUpdate): Promise<User | null> {
    this.logger.log(`Updating user id=${userData.id}`);
    const user = await this.userRepository.findOne(userData.id);

    if (!user) {
      this.logger.warn(`User not found for update: id=${userData.id}`);
      throw new RpcException({
        statusCode: 404,
        message: `User with id:${userData.id} not found`,
      });
    }

    this.userRepository.assign(user, userData);
    await this.em.flush();

    this.logger.log(`User updated: id=${user.id}`);
    return user;
  }

  @EnsureRequestContext()
  async remove(id: string): Promise<User | null> {
    this.logger.log(`Removing user id=${id}`);
    const user = await this.userRepository.findOne(id);

    if (!user) {
      this.logger.warn(`User not found for removal: id=${id}`);
      throw new RpcException({
        statusCode: 404,
        message: `User with id:${id} not found`,
      });
    }

    await this.em.removeAndFlush(user);

    this.logger.log(`User removed: id=${id}`);
    return user;
  }
}