export class RoomReservedEvent {
    constructor(
        public readonly bookingId: string,
        public readonly roomId: string,
        public readonly dateFrom: Date,
        public readonly dateTo: Date,
    ) {}
}