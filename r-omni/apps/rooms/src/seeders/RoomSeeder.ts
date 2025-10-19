import { Seeder } from '@mikro-orm/seeder';
import { Building } from '../entities/building.entity';
import { RoomType } from '../entities/room.type';
import {Room} from "../entities/rooms.entity";

export class RoomSeeder extends Seeder {
    async run(em) {
        await em.nativeDelete(Room, {});

        const buildings = await em.find(Building, {});
        if (buildings.length === 0) {
            throw new Error('Нет корпусов в БД — сначала запусти BuildingSeeder');
        }

        const MAX_ROOMS_LIMIT = 50;
        for (const building of buildings) {
            for (let i = 1; i <= MAX_ROOMS_LIMIT; i++) {

                const type =
                    (i % 2 === 0) ? RoomType.STANDARD : RoomType.ECONOMY;
                const price = type === RoomType.STANDARD
                    ? 4000 + Math.floor(Math.random() * 1000)
                    : 2000 + Math.floor(Math.random() * 500);

                const description = `${type === RoomType.STANDARD ? 'Стандартный' : 'Эконом'} номер №${i} в корпусе ${building.name}`;
                const is_available = true;

                em.create(Room, new Room(type, building, price, description, is_available));
            }
        }
    }
}
