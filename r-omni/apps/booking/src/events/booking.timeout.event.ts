export class BookingTimeoutEvent {
    constructor(
        public readonly bookingId: string,
        public readonly reason: string
    ) {}
}
