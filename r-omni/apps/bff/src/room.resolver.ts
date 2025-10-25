import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import {NatsClientService} from "./nats-client.service";
import {Logger, ParseUUIDPipe} from "@nestjs/common";
import {firstValueFrom} from "rxjs";
import {RoomModel} from "./model/room.model";

@Resolver(() => RoomModel)
export class RoomResolver {
    private readonly logger = new Logger(RoomResolver.name);

    constructor(private readonly natsClient: NatsClientService) {}

    @Query(() => [RoomModel])
    async rooms(): Promise<RoomModel[]> {
        this.logger.log('GraphQL query: rooms');
        return firstValueFrom(this.natsClient.send('room.findAll', ''));
    }

    @Query(() => RoomModel, { nullable: true })
    async room(@Args('id', { type: () => ID }, ParseUUIDPipe ) id: string): Promise<RoomModel | null> {
        this.logger.log(`GraphQL query: room with id=${id}`);
        return firstValueFrom(this.natsClient.send('room.findOne', id));
    }
}
