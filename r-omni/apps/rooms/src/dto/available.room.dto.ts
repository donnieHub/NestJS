import {RoomType} from "../entities/room.type";
import {Field, ID, ObjectType} from "@nestjs/graphql";

@ObjectType()
export class AvailableRoomDto {
    @Field(() => ID)
    id: string;

    @Field(() => RoomType)
    type: RoomType;

    @Field()
    price: number;

    @Field({ nullable: true })
    description?: string;

    @Field()
    is_available: boolean;

    @Field({ nullable: true })
    buildingName?: string;

    @Field({ nullable: true })
    buildingAddress?: string;

    constructor(
        id: string,
        type: RoomType,
        price: number,
        description: string,
        is_available: boolean,
        building: {
            id: string;
            name: string;
            address?: string;
        }
    ) {
        this.id = id;
        this.type = type;
        this.price = price;
        this.description = description;
        this.is_available = is_available;
        this.buildingName = building.name;
        this.buildingAddress = building.address;
    }
}