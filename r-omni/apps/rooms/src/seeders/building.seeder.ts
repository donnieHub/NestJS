import { Seeder } from '@mikro-orm/seeder';
import {EntityManager} from "@mikro-orm/postgresql";
import {Building} from "../entities/building.entity";

export class BuildingSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        await em.nativeDelete(Building, {});

        const buildings = [
            { name: 'Корпус 1', address: 'ул. Центральная, д. 1, к. 1', description: '' },
            { name: 'Корпус 2', address: 'ул. Центральная, д. 1, к. 2', description: '' },
            { name: 'Корпус 3', address: 'ул. Центральная, д. 1, к. 3', description: '' },
            { name: 'Корпус 4', address: 'ул. Центральная, д. 1, к. 4', description: '' },
            { name: 'Корпус 5', address: 'ул. Центральная, д. 1, к. 5', description: '' }
        ];

        for (const buildingData of buildings) {
            const building = em.create(Building, buildingData);
            em.persist(building);
        }

        await em.flush();
    }
}