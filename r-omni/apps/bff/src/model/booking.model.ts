import {ObjectType, Field, ID} from '@nestjs/graphql';
import {BookingStatus} from "../../../booking/src/entities/booking.status";

@ObjectType()
export class BookingModel {
    @Field(() => ID)
    id: string;

    @Field()
    user_id: string;

    @Field()
    room_id: string;

    @Field(() => Date)
    date_from: Date;

    @Field(() => Date)
    date_to: Date;

    @Field(() => BookingStatus)
    status: BookingStatus;

    @Field(() => Date)
    created_at: Date;
}
