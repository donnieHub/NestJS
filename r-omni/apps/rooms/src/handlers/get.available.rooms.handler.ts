import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {RoomReadRepository} from "../room.read.repository";
import {Logger} from "@nestjs/common";
import {GetAvailableRoomsQuery} from "../queries/get.available.rooms.query";
import {AvailableRoomDto} from "../dto/available.room.dto";

@QueryHandler(GetAvailableRoomsQuery)
export class GetAvailableRoomsHandler implements IQueryHandler<GetAvailableRoomsQuery> {
    private readonly logger = new Logger(GetAvailableRoomsHandler.name);

    constructor(private readonly roomReadRepository: RoomReadRepository) {}

    async execute(query: GetAvailableRoomsQuery): Promise<AvailableRoomDto[]> {

        this.logger.log(`GetAvailableRoomsHandler: get room from ${query.startDate} to ${query.endDate}`);
        return this.roomReadRepository.findAvailableRooms(query);
    }
}
