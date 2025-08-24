import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import {UserModel} from "./model/user.model";
import {NatsClientService} from "./nats-client.service";
import {ParseUUIDPipe} from "@nestjs/common";
import {UserCreate} from "../../user/src/dto/user.create";
import {UserUpdate} from "../../user/src/dto/user.update";

@Resolver(() => UserModel)
export class UserResolver {
    constructor(private readonly natsClient: NatsClientService) {}

    @Query(() => [UserModel])
    async users(): Promise<UserModel[]> {
        return this.natsClient.send('user.findAll', '').toPromise();
    }

    @Query(() => UserModel, { nullable: true })
    async user(@Args('id', { type: () => ID }, ParseUUIDPipe ) id: string): Promise<UserModel | null> {
        return this.natsClient.send('user.findOne', id).toPromise();
    }

    @Mutation(() => UserModel, { nullable: true })
    async createUser(@Args('input') input: UserCreate): Promise<UserModel | null> {
        return this.natsClient.send('user.create', input).toPromise();
    }

    @Mutation(() => UserModel, { nullable: true })
    async updateUser(@Args('input') input: UserUpdate): Promise<UserModel | null> {
        return this.natsClient.send('user.update', input).toPromise();
    }

    @Mutation(() => UserModel, { nullable: true })
    async removeUser(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string): Promise<UserModel | null> {
        return this.natsClient.send('user.remove', id).toPromise();
    }
}
