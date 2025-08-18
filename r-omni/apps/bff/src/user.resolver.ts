import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import {NatsClientService} from "../../r-omni/src/client/nats-client.service";
import {UserModel} from "./model/user.model";
import {CreateUserInput} from "./dto/create.user.input";
import {UpdateUserInput} from "./dto/update.user.input";

@Resolver(() => UserModel)
export class UserResolver {
    constructor(private readonly natsClient: NatsClientService) {}

    @Query(() => [UserModel])
    async users(): Promise<UserModel[]> {
        return this.natsClient.send('user.findAll', '').toPromise();
    }

    @Query(() => UserModel, { nullable: true })
    async user(@Args('id', { type: () => ID }) id: string): Promise<UserModel | null> {
        return this.natsClient.send('user.findOne', id).toPromise();
    }

    @Mutation(() => UserModel, { nullable: true })
    async createUser(@Args('input') input: CreateUserInput): Promise<UserModel | null> {
        // ⚠️ Пароль нужно хэшировать в user-сервисе, а BFF просто проксирует
        return this.natsClient.send('user.create', input).toPromise();
    }

    @Mutation(() => UserModel, { nullable: true })
    async updateUser(@Args('input') input: UpdateUserInput): Promise<UserModel | null> {
        return this.natsClient.send('user.update', input).toPromise();
    }

    @Mutation(() => UserModel, { nullable: true })
    async removeUser(@Args('id', { type: () => ID }) id: string): Promise<UserModel | null> {
        return this.natsClient.send('user.remove', id).toPromise();
    }
}
