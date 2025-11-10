export class BookingCreatedEvent {
    constructor(
        public readonly bookingId: string,
        public readonly userId: string,
        public readonly roomId: string,
        public readonly dateFrom: Date,
        public readonly dateTo: Date,
    ) {}
}