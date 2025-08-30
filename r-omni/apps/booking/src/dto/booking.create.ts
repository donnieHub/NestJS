import {IsDate, IsNotEmpty, IsUUID} from "class-validator";
import {Field, InputType} from "@nestjs/graphql";

@InputType()
export class BookingCreate {

    @IsUUID()
    @IsNotEmpty({ message: 'Room ID cannot be empty!' })
    @Field()
    room_id: string;

    @IsDate({ message: 'date_from must be a valid Date' })
    @Field(() => Date)
    date_from: Date;

    @IsDate({ message: 'date_to must be a valid Date' })
    @Field(() => Date)
    date_to: Date;
}