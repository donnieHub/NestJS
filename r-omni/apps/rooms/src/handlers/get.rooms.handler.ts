import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {RoomReadRepository} from "../room.read.repository";
import {Logger} from "@nestjs/common";
import {GetRoomsQuery} from "../queries/get.rooms.query";
import {AvailableRoomDto} from "../dto/available.room.dto";

@QueryHandler(GetRoomsQuery)
export class GetRoomsHandler implements IQueryHandler<GetRoomsQuery> {
    private readonly logger = new Logger(GetRoomsHandler.name);

    constructor(private readonly roomReadRepository: RoomReadRepository) {}

    async execute(): Promise<AvailableRoomDto[]> {
        this.logger.log(`GetRoomsHandler: get all rooms`);
        return this.roomReadRepository.findAll();
    }
}
