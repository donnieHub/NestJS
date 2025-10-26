import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {RoomReadRepository} from "../room.read.repository";
import {Logger} from "@nestjs/common";
import {RoomReadModel} from "../models/room.read.model";
import {GetRoomsQuery} from "../queries/get.rooms.query";

@QueryHandler(GetRoomsQuery)
export class GetRoomsHandler implements IQueryHandler<GetRoomsQuery> {
    private readonly logger = new Logger(GetRoomsHandler.name);

    constructor(private readonly roomReadRepository: RoomReadRepository) {}

    async execute(): Promise<RoomReadModel[]> {
        this.logger.log(`GetRoomsHandler: get all rooms`);
        return this.roomReadRepository.findAll();
    }
}
