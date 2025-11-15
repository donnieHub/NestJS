import {Injectable, Logger} from "@nestjs/common";
import {ClientProxy, ClientProxyFactory, Transport} from "@nestjs/microservices";
import {SchedulerRegistry} from "@nestjs/schedule";
import {BookingTimeoutEvent} from "../events/booking.timeout.event";

@Injectable()
export class TimeoutService {
    private readonly logger = new Logger(TimeoutService.name);
    private natsClient: ClientProxy;

    constructor(
        private readonly schedulerRegistry: SchedulerRegistry,
    ) {
        this.natsClient = ClientProxyFactory.create({
            transport: Transport.NATS,
            options: { servers: ['nats://localhost:4222'] },
        });
    }

    scheduleTimeout(bookingId: string, timeoutMs: number = 30000) {
        const timeout = setTimeout(() => {
            this.handleBookingTimeout(bookingId);
        }, timeoutMs);

        this.logger.log(`schedulerRegistry.addTimeout for booking ${bookingId}`);
        this.schedulerRegistry.addTimeout(`booking_${bookingId}`, timeout);
    }

    cancelTimeout(bookingId: string) {
        try {
            this.logger.log(`schedulerRegistry.deleteTimeout for booking ${bookingId}`);
            this.schedulerRegistry.deleteTimeout(`booking_${bookingId}`);
        } catch (e) {
            this.logger.warn(`Timeout for booking ${bookingId} not found`);
        }
    }

    private async handleBookingTimeout(bookingId: string) {
        this.logger.warn(`Booking ${bookingId} timed out`);

        // Отправляем событие таймаута
        this.natsClient.emit('booking.timeout', new BookingTimeoutEvent(
            bookingId,
            'Reservation timeout'
        ));
    }
}