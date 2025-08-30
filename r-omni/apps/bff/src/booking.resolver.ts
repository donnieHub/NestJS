import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';

import {NatsClientService} from "./nats-client.service";
import {Logger, ParseUUIDPipe} from "@nestjs/common";
import {BookingModel} from "./model/booking.model";
import {BookingInput} from "../../booking/src/dto/booking.input";

@Resolver(() => BookingModel)
export class BookingResolver {
    private readonly logger = new Logger(BookingResolver.name);

    constructor(private readonly natsClient: NatsClientService) {}

    @Query(() => [BookingModel])
    async bookings(): Promise<BookingModel[]> {
        this.logger.log('GraphQL query: get bookings');
        return this.natsClient.send('booking.findAll', '').toPromise();
    }

    @Mutation(() => BookingModel, { nullable: true })
    async createBooking(@Args('input') input: BookingInput): Promise<BookingModel | null> {
        this.logger.log(`GraphQL mutation: createBooking with room_id=${input.room_id}`);
        return this.natsClient.send('booking.create', input).toPromise();
    }

    @Mutation(() => BookingModel, { nullable: true })
    async cancelBooking(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string): Promise<boolean> {
        this.logger.log(`GraphQL mutation: cancelBooking id=${id}`);
        return this.natsClient.send('booking.cancel', id).toPromise();
    }
}
