import {registerEnumType} from "@nestjs/graphql";
import {
    BookingStatus as GrpcBookingStatus,
} from "contracts/grpc/dist/booking.v1";

import {
    BookingStatus as GqlBookingStatus,
} from "./booking.status";

export enum BookingStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

registerEnumType(BookingStatus, {
    name: 'BookingStatus',
    description: 'Booking status',
});

// брать мапер из grpc контракта
export function mapGrpcStatus(status: GrpcBookingStatus): GqlBookingStatus {
    switch (status) {
        case GrpcBookingStatus.BOOKING_STATUS_PENDING:
            return GqlBookingStatus.PENDING;

        case GrpcBookingStatus.BOOKING_STATUS_CONFIRMED:
            return GqlBookingStatus.CONFIRMED;

        case GrpcBookingStatus.BOOKING_STATUS_CANCELLED:
            return GqlBookingStatus.CANCELLED;

        case GrpcBookingStatus.BOOKING_STATUS_COMPLETED:
            return GqlBookingStatus.COMPLETED;

        case GrpcBookingStatus.BOOKING_STATUS_FAILED:
            return GqlBookingStatus.FAILED;

        default:
            return GqlBookingStatus.PENDING;
    }
}

export function mapGqlStatusToGrpc(status: GqlBookingStatus): GrpcBookingStatus {
    switch (status) {
        case GqlBookingStatus.PENDING:
            return GrpcBookingStatus.BOOKING_STATUS_PENDING;

        case GqlBookingStatus.CONFIRMED:
            return GrpcBookingStatus.BOOKING_STATUS_CONFIRMED;

        case GqlBookingStatus.CANCELLED:
            return GrpcBookingStatus.BOOKING_STATUS_CANCELLED;

        case GqlBookingStatus.COMPLETED:
            return GrpcBookingStatus.BOOKING_STATUS_COMPLETED;

        case GqlBookingStatus.FAILED:
            return GrpcBookingStatus.BOOKING_STATUS_FAILED;

        default:
            // Для неизвестных статусов GraphQL возвращаем UNSPECIFIED
            return GrpcBookingStatus.BOOKING_STATUS_UNSPECIFIED;
    }
}