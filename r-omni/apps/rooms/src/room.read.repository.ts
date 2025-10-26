import {EntityManager} from "@mikro-orm/postgresql";
import {RoomReadModel} from "./models/room.read.model";
import {RoomType} from "./entities/room.type";
import {Inject, Injectable} from "@nestjs/common";

@Injectable()
export class RoomReadRepository  {

    constructor(
        @Inject(EntityManager) private readonly em: EntityManager
    ) {}

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