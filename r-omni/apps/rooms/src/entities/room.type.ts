import {registerEnumType} from "@nestjs/graphql";

export enum RoomType {
    STANDARD = 'standard',
    ECONOMY = 'economy',
}

registerEnumType(RoomType, {
    name: 'RoomType',
    description: 'Room type',
});