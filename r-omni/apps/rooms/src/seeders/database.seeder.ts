import { Seeder } from '@mikro-orm/seeder';
import {EntityManager} from "@mikro-orm/postgresql";
import {BuildingSeeder} from "./building.seeder";
import {RoomSeeder} from "./room.seeder";

export class DatabaseSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        // Запуск сидеров в определенном порядке
        await this.call(em, [BuildingSeeder, RoomSeeder]);
    }
}