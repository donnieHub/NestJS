import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {BookRoomCommand} from "../commands/book.room.command";
import {Logger} from "@nestjs/common";
import {RoomRepository} from "../room.repository";

@CommandHandler(BookRoomCommand)
export class BookRoomHandler implements ICommandHandler<BookRoomCommand> {
    private readonly logger = new Logger(BookRoomHandler.name);

    constructor(
        private readonly roomRepository: RoomRepository,
        // private readonly eventBus: EventBus,
    ) {}

    async execute(command: BookRoomCommand) {
        const { id, is_available, date_from, date_to } = command;
        if (is_available) {
            this.logger.log(`Try to book room with id ${id} from ${date_from} to ${date_to}`);

            // Бизнес-логика создания пользователя
            // const bookedRoom = await this.roomRepository.book({ date_from, date_to });

            // Публикуем событие о том, что пользователь создан
            // this.eventBus.publish(new UserCreatedEvent(bookedRoom.id, bookedRoom.email));

            // return bookedRoom.id; // Возвращаем ID, но не всю сущность
        }


    }
}
