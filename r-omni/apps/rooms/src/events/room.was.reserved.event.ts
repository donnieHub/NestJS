export class RoomWasReservedEvent {
    constructor(
        public readonly bookingId: string,
        public readonly roomId: string,
        public readonly success: boolean,
    ) {}
}