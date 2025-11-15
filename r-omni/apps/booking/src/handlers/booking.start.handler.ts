import {CommandHandler, EventBus, ICommandHandler} from '@nestjs/cqrs';
import {Logger} from "@nestjs/common";
import {BookingStartCommand} from "../commands/booking.start.command";

@CommandHandler(BookingStartCommand)
export class BookingStartHandler implements ICommandHandler<BookingStartCommand> {
    private readonly logger = new Logger(BookingStartHandler.name);

    constructor(
        private readonly eventBus: EventBus,
    ) {}

    async execute(command: BookingStartCommand) {
        const { bookingId, userId, roomId, dateFrom, dateTo } = command;
            this.logger.log(`Saga was logged BookingStartCommand`);
        }
}
