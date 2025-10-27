import {ObjectType, Field, ID} from '@nestjs/graphql';
import {RoomType} from "../../../rooms/src/entities/room.type";

@ObjectType()
export class RoomModel {
    @Field(() => ID)
    id: string;

    @Field(() => RoomType)
    type: RoomType;

    @Field()
    price: number;

    @Field()
    description?: string;

    @Field()
    is_available: boolean;

    @Field({ nullable: true })
    buildingName?: string;

    @Field({ nullable: true })
    buildingAddress?: string;
}
