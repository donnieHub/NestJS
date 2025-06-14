export class Room {
    id?: number;
    type: string;
    description: string;

    constructor(type: string, description: string, id?: number) {
        this.type = type;
        this.description = description;
        this.id = id;
    }
}