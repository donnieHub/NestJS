import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {RoomReadRepository} from "../room.read.repository";
import {Logger} from "@nestjs/common";
import {RoomReadModel} from "../models/room.read.model";
import {FindAvailableRoomsQuery} from "../queries/find.available.rooms.query";

@QueryHandler(FindAvailableRoomsQuery)
export class GetAvailableRoomsHandler implements IQueryHandler<FindAvailableRoomsQuery> {
    private readonly logger = new Logger(GetAvailableRoomsHandler.name);

    constructor(private readonly roomReadRepository: RoomReadRepository) {}

    async execute(query: FindAvailableRoomsQuery): Promise<RoomReadModel[]> {

        this.logger.log(`GetAvailableRoomsHandler: get room from ${query.startDate} to ${query.endDate}`);
        return this.roomReadRepository.findAvailableRooms(query);
    }
}
