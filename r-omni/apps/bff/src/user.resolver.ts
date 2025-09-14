import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import {UserModel} from "./model/user.model";
import {NatsClientService} from "./nats-client.service";
import {Logger, ParseUUIDPipe} from "@nestjs/common";
import {UserCreate} from "../../user/src/dto/user.create";
import {UserUpdate} from "../../user/src/dto/user.update";
import {AuthPayload} from "./model/auth.payload";
import {RegisterInput} from "../../user/src/dto/register.input";
import {LoginInput} from "../../user/src/dto/login.input";
import {firstValueFrom} from "rxjs";

@Resolver(() => UserModel)
export class UserResolver {
    private readonly logger = new Logger(UserResolver.name);

    constructor(private readonly natsClient: NatsClientService) {}

    @Mutation(() => AuthPayload)
    async register(@Args('input') input: RegisterInput): Promise<AuthPayload>  {
        this.logger.log(`GraphQL mutation: register user with email=${input.email}`);
        return firstValueFrom(this.natsClient.send('user.register', input));
    }

    @Mutation(() => AuthPayload)
    async login(@Args('input') input: LoginInput): Promise<AuthPayload> {
        this.logger.log(`GraphQL mutation: login user with email=${input.email}`);
        return firstValueFrom(this.natsClient.send('user.login', input));
    }

    @Query(() => [UserModel])
    async users(): Promise<UserModel[]> {
        this.logger.log('GraphQL query: users');
        return firstValueFrom(this.natsClient.send('user.findAll', ''));
    }

    @Query(() => UserModel, { nullable: true })
    async user(@Args('id', { type: () => ID }, ParseUUIDPipe ) id: string): Promise<UserModel | null> {
        this.logger.log(`GraphQL query: user with id=${id}`);
        return firstValueFrom(this.natsClient.send('user.findOne', id));
    }

    @Mutation(() => UserModel, { nullable: true })
    async createUser(@Args('input') input: UserCreate): Promise<UserModel | null> {
        this.logger.log(`GraphQL mutation: createUser with email=${input.email}`);
        return firstValueFrom(this.natsClient.send('user.create', input));
    }

    @Mutation(() => UserModel, { nullable: true })
    async updateUser(@Args('input') input: UserUpdate): Promise<UserModel | null> {
        this.logger.log(`GraphQL mutation: updateUser id=${input.id}`);
        return firstValueFrom(this.natsClient.send('user.update', input));
    }

    @Mutation(() => UserModel, { nullable: true })
    async removeUser(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string): Promise<UserModel | null> {
        this.logger.log(`GraphQL mutation: removeUser id=${id}`);
        return firstValueFrom(this.natsClient.send('user.remove', id));
    }
}
