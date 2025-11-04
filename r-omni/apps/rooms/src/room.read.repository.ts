import {EnsureRequestContext, EntityManager} from "@mikro-orm/postgresql";
import {RoomType} from "./entities/room.type";
import {Inject, Injectable, Logger} from "@nestjs/common";
import {AvailableRoomDto} from "./dto/available.room.dto";
import {Room} from "./entities/rooms.entity";

interface FindAvailableRoomsParams {
    startDate: Date;
    endDate: Date;
    buildingId?: string;
}

@Injectable()
export class RoomReadRepository  {
    private readonly logger = new Logger(RoomReadRepository.name);

    constructor(
        @Inject(EntityManager) private readonly em: EntityManager
    ) {}

    @EnsureRequestContext()
    async findAvailableRooms(params: FindAvailableRoomsParams): Promise<AvailableRoomDto[]> {
        const { startDate, endDate, buildingId } = params;

        const qb = this.em.createQueryBuilder(Room, 'r')
            .select(['r.*', 'b.*']) // выбираем все поля обеих сущностей
            .leftJoin('r.building', 'b')
            .where('r.is_available = true')
            .andWhere(`NOT EXISTS (
        SELECT 1 FROM room_availability ra 
        WHERE ra.room_id = r.id 
        AND ra.is_booked = true 
        AND (
            (ra.date_from <= ? AND ra.date_to >= ?) OR
            (ra.date_from <= ? AND ra.date_to >= ?) OR
            (ra.date_from >= ? AND ra.date_to <= ?)
        )
    )`, [endDate, startDate, startDate, endDate, startDate, endDate]);

        if (buildingId) {
            qb.andWhere('b.id = ?', [buildingId]);
        }

        const results = await qb.getResult();

        this.logger.log(results.map(row => new AvailableRoomDto(
            row.id,
            row.type as RoomType,
            row.price,
            row.description,
            row.is_available,
            {
                id: row.building.id,
                name: row.building.name,
                address: row.building.address,
            }
        )))

        return results.map(row => new AvailableRoomDto(
            row.id,
            row.type as RoomType,
            row.price,
            row.description, //не работает проблема в RoomModel в bff
            row.is_available,
            {
                id: row.building.id,
                name: row.building.name,
                address: row.building.address,
            }
        ));
    }

    async findAll(): Promise<AvailableRoomDto[]> {
        const results = await this.em.getConnection().execute(`
      SELECT 
        r.id,
        r.type,
        r.price,
        r.description,
        r.is_available,
        r.building_id as "buildingId",
        b.name as "buildingName",
        b.address as "buildingAddress"
      FROM rooms r
      LEFT JOIN building b ON r.building_id = b.id
    `);

        return results.map(row => new AvailableRoomDto(
            row.id,
            row.type as RoomType,
            parseFloat(row.price),
            row.description,
            row.is_available,
            {
                id: row.buildingId,
                name: row.buildingName,
                address: row.buildingAddress
            }
        ));
    }

    async findById(id: string): Promise<AvailableRoomDto | null> {
        const [result] = await this.em.getConnection().execute(`
      SELECT 
        r.id,
        r.type,
        r.price,
        r.description,
        r.is_available,
        r.building_id as "buildingId",
        b.name as "buildingName",
        b.address as "buildingAddress"
      FROM rooms r
      LEFT JOIN building b ON r.building_id = b.id
      WHERE r.id = ?
    `, [id]);

        if (!result) return null;

        return new AvailableRoomDto(
            result.id,
            result.type as RoomType,
            parseFloat(result.price),
            result.description,
            result.is_available,
            {
                id: result.buildingId,
                name: result.buildingName,
                address: result.buildingAddress
            }
        );
    }
}