import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { RoomAvailability } from '../entities/room.availability.entity';
import { Room } from '../entities/rooms.entity';

export class RoomAvailabilitySeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        const rooms = await em.find(Room, {});

        if (rooms.length === 0) {
            console.warn('Нет комнат в базе! Сначала засейдьте таблицу rooms.');
            return;
        }

        await em.nativeDelete(RoomAvailability, {});

        // Пример: для каждой комнаты создаём 3 записи
        for (const room of rooms) {
            const today = new Date();

            const availabilities = [
                new RoomAvailability(
                    new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
                    false
                ),
                new RoomAvailability(
                    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
                    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
                    true
                ),
                new RoomAvailability(
                    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4),
                    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
                    false
                ),
            ];

            for (const availability of availabilities) {
                availability.room = room;
                em.persist(availability);
            }
        }
    }
}