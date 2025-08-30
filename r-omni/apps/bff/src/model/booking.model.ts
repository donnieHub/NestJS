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

    @Field(() => Date, { nullable: false })
    date_from: Date;

    @Field(() => Date, { nullable: false })
    date_to: Date;

    @Field(() => BookingStatus, { nullable: false })
    status: BookingStatus;

    @Field(() => Date, { nullable: false })
    created_at: Date;
}
