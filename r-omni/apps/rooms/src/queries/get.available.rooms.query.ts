export class GetAvailableRoomsQuery {
    constructor(
        public readonly startDate: Date,
        public readonly endDate: Date,
        public readonly buildingId?: string,
    ) {}
}
