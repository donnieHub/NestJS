import {IsBoolean, IsDecimal, IsIn, IsOptional, IsString, IsUUID, Min} from "class-validator";
import {Field, InputType} from "@nestjs/graphql";
import {BookingStatus} from "../../../booking/src/entities/booking.status";
import {RoomType} from "../entities/room.type";

@InputType()
export class RoomUpdate {

    @IsUUID()
    @Field()
    id: string;

    @IsString()
    @IsIn(Object.values(BookingStatus), { message: 'type must be one of: standard, economy' })
    @IsOptional()
    @Field({ nullable: true })
    type?: RoomType;

    @IsDecimal()
    @Min(0.00)
    @IsOptional()
    @Field({ nullable: true })
    price?: number;

    @IsString()
    @IsOptional()
    @Field({ nullable: true })
    description?: string;

    @IsBoolean()
    @IsOptional()
    @Field({ nullable: true })
    is_available?: boolean;
}