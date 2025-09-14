import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import {UserModel} from "./model/user.model";
import {NatsClientService} from "./nats-client.service";
import {Logger, ParseUUIDPipe} from "@nestjs/common";
import {UserCreate} from "../../user/src/dto/user.create";
import {UserUpdate} from "../../user/src/dto/user.update";
import {AuthPayload} from "./model/auth.payload";
import {RegisterInput} from "../../user/src/dto/register.input";
import {LoginInput} from "../../user/src/dto/login.input";

@Resolver(() => UserModel)
export class UserResolver {
    private readonly logger = new Logger(UserResolver.name);

    constructor(private readonly natsClient: NatsClientService) {}

    @Mutation(() => AuthPayload)
    async register(@Args('input') input: RegisterInput): Promise<AuthPayload>  {
        return this.natsClient.send('user.register', input).toPromise();
    }

    @Mutation(() => AuthPayload)
    async login(@Args('input') input: LoginInput): Promise<AuthPayload> {
        return this.natsClient.send('user.login', input).toPromise();
    }

    @Query(() => [UserModel])
    async users(): Promise<UserModel[]> {
        this.logger.log('GraphQL query: users');
        return this.natsClient.send('user.findAll', '').toPromise();
    }

    @Query(() => UserModel, { nullable: true })
    async user(@Args('id', { type: () => ID }, ParseUUIDPipe ) id: string): Promise<UserModel | null> {
        this.logger.log(`GraphQL query: user with id=${id}`);
        return this.natsClient.send('user.findOne', id).toPromise();
    }

    @Mutation(() => UserModel, { nullable: true })
    async createUser(@Args('input') input: UserCreate): Promise<UserModel | null> {
        this.logger.log(`GraphQL mutation: createUser with email=${input.email}`);
        return this.natsClient.send('user.create', input).toPromise();
    }

    @Mutation(() => UserModel, { nullable: true })
    async updateUser(@Args('input') input: UserUpdate): Promise<UserModel | null> {
        this.logger.log(`GraphQL mutation: updateUser id=${input.id}`);
        return this.natsClient.send('user.update', input).toPromise();
    }

    @Mutation(() => UserModel, { nullable: true })
    async removeUser(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string): Promise<UserModel | null> {
        this.logger.log(`GraphQL mutation: removeUser id=${id}`);
        return this.natsClient.send('user.remove', id).toPromise();
    }
}
