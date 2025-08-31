import {IsBoolean, IsDecimal, IsIn, IsNotEmpty, IsString, Min} from "class-validator";
import {Field, InputType} from "@nestjs/graphql";
import {RoomType} from "../entities/room.type";
import {BookingStatus} from "../../../booking/src/entities/booking.status";

@InputType()
export class RoomCreate {

    @IsString()
    @IsNotEmpty({ message: 'Room type cannot be empty!' })
    @IsIn(Object.values(BookingStatus), { message: 'type must be one of: standard, economy' })
    @Field()
    type: RoomType;

    @IsDecimal()
    @IsNotEmpty({ message: 'Price cannot be empty!' })
    @Min(0.00)
    @Field()
    price: number;

    @IsString()
    @Field()
    description: string;

    @IsBoolean()
    @Field()
    is_available: boolean;
}