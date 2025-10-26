import {RoomType} from "../entities/room.type";

export class RoomReadModel {
    constructor(
        public readonly id: string,
        public readonly type: RoomType,
        public readonly price: number,
        public readonly description: string,
        public readonly is_available: boolean,
        public readonly buildingId: string,
        public readonly buildingName: string,
        public readonly buildingAddress: string
    ) {}
}