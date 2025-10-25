export class BookRoomCommand {
    constructor(
        public readonly id: string,
        public readonly is_available: boolean,
        public readonly date_from: Date,
        public readonly date_to: Date,
    ) {}
}
