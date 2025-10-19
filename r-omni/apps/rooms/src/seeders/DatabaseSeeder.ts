import { Seeder } from '@mikro-orm/seeder';
import {EntityManager} from "@mikro-orm/postgresql";
import {BuildingSeeder} from "./BuildingSeeder";
import {RoomSeeder} from "./RoomSeeder";

export class DatabaseSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        // Запуск сидеров в определенном порядке
        await this.call(em, [BuildingSeeder, RoomSeeder]);
    }
}