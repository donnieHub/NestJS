export class RoomRejectedEvent {
    constructor(
        public readonly bookingId: string,
        public readonly roomId: string,
        public readonly reason: string
    ) {}
}