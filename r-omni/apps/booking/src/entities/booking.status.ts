import {registerEnumType} from "@nestjs/graphql";

export enum BookingStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed',
    REJECTED = 'rejected',
}

registerEnumType(BookingStatus, {
    name: 'BookingStatus',
    description: 'Booking status',
});