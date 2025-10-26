import {GetRoomByIdQuery} from "../queries/get.room.by.id.query";
import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {RoomReadRepository} from "../room.read.repository";
import {Logger} from "@nestjs/common";
import {RoomReadModel} from "../models/room.read.model";

@QueryHandler(GetRoomByIdQuery)
export class GetRoomByIdHandler implements IQueryHandler<GetRoomByIdQuery> {
    private readonly logger = new Logger(GetRoomByIdHandler.name);

    constructor(private readonly roomReadRepository: RoomReadRepository) {}

    async execute(query: GetRoomByIdQuery): Promise<RoomReadModel | null> {
        const { roomId } = query;

        this.logger.log(`GetRoomByIdHandler: get room by id=${roomId}`);
        return this.roomReadRepository.findById(roomId);
    }
}
