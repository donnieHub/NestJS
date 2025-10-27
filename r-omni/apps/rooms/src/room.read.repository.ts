import {EntityManager} from "@mikro-orm/postgresql";
import {RoomReadModel} from "./models/room.read.model";
import {RoomType} from "./entities/room.type";
import {Inject, Injectable} from "@nestjs/common";

interface FindAvailableRoomsParams {
    startDate: Date;
    endDate: Date;
    buildingId?: string;
}

@Injectable()
export class RoomReadRepository  {

    constructor(
        @Inject(EntityManager) private readonly em: EntityManager
    ) {}

    async findAvailableRooms(params: FindAvailableRoomsParams): Promise<RoomReadModel[]> {
        const { startDate, endDate, buildingId } = params;

        let buildingCondition = '';
        const queryParams: any[] = [];

        // Упрощенная логика проверки пересечения дат
        const dateCondition = `
            AND NOT EXISTS (
                SELECT 1 FROM room_availability ra 
                WHERE ra.room_id = r.id 
                AND ra.is_booked = true
                AND ra.date_from < ? 
                AND ra.date_to > ?
            )
        `;

        queryParams.push(endDate, startDate);

        if (buildingId) {
            buildingCondition = 'AND r.building_id = ?';
            queryParams.push(buildingId);
        }

        const query = `
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
            WHERE r.is_available = true
                ${dateCondition}
                  ${buildingCondition}
            ORDER BY r.price ASC
        `;

        const results = await this.em.getConnection().execute(query, queryParams);

        return results.map(row => new RoomReadModel(
            row.id,
            row.type as RoomType,
            parseFloat(row.price),
            row.description,
            row.is_available,
            row.buildingId,
            row.buildingName,
            row.buildingAddress
        ));
    }

    async findAll(): Promise<RoomReadModel[]> {
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

        return results.map(row => new RoomReadModel(
            row.id,
            row.type as RoomType,
            parseFloat(row.price),
            row.description,
            row.is_available,
            row.buildingId,
            row.buildingName,
            row.buildingAddress
        ));
    }

    async findById(id: string): Promise<RoomReadModel | null> {
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

        return new RoomReadModel(
            result.id,
            result.type as RoomType,
            parseFloat(result.price),
            result.description,
            result.is_available,
            result.buildingId,
            result.buildingName,
            result.buildingAddress
        );
    }
}