import {Injectable, Logger} from "@nestjs/common";
import {ofType, Saga} from "@nestjs/cqrs";
import {ignoreElements, Observable, tap} from "rxjs";
import {BookingStartEvent} from "../events/booking.start.event";
import {BookingStartCommand} from "../commands/booking.start.command";

@Injectable()
export class bookingStartedSaga {
    private readonly logger = new Logger(bookingStartedSaga.name);

    @Saga()
    bookingStarted = (events$: Observable<BookingStartEvent>): Observable<BookingStartCommand> => {
        return events$.pipe(
            ofType(BookingStartEvent),
            tap((event: BookingStartEvent) => {
                this.logger.log(`Saga: Booking start event received - Booking ID: ${event.bookingId}, User: ${event.userId}`);
            }),
            // Игнорируем создание команд
            ignoreElements(),
            // map((event) => new BookingStartCommand(
            //     event.bookingId,
            //     event.userId,
            //     event.roomId,
            //     event.dateFrom,
            //     event.dateTo
            // )),
        );
    }
}