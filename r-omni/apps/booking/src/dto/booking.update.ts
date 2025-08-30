import {IsDate, IsIn, IsNotEmpty, IsOptional, IsUUID} from "class-validator";
import {Field, InputType} from "@nestjs/graphql";
import {BookingStatus} from "../entities/booking.status";

@InputType()
export class BookingUpdate {

    @IsUUID()
    @Field()
    id: string;

    @IsUUID()
    @IsNotEmpty({ message: 'Room ID cannot be empty!' })
    @Field()
    room_id: string;

    @IsDate({ message: 'date_from must be a valid Date' })
    @Field(() => Date, { nullable: true })
    @IsOptional()
    date_from?: Date;

    @IsDate({ message: 'date_to must be a valid Date' })
    @Field(() => Date, { nullable: true })
    @IsOptional()
    date_to?: Date;

    @IsIn(Object.values(BookingStatus), { message: 'status must be one of: pending, confirmed, cancelled, completed, rejected' })
    @Field({ nullable: true })
    @IsOptional()
    status?: BookingStatus;
}