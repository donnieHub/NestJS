import {Injectable, Logger} from "@nestjs/common";
import {InjectGrpcClient} from "@rsdk/grpc.clients";
import {bookingServer} from "./booking.grpc-server";
import {
    BookingServiceClient,
    GetAllBookingsRequest,
} from "../../../contracts/grpc/dist/booking.v1";
import {BookingModel} from "./model/booking.model";
import {mapGrpcStatus} from "../../booking/src/entities/booking.status";

@Injectable()
export class BookingService {
    private readonly logger = new Logger(BookingService.name);

    constructor(
        @InjectGrpcClient(bookingServer.booking)
        private readonly booking: BookingServiceClient,
    ) {
    }

    async bookings(): Promise<BookingModel[]> {
        this.logger.log('BookingService: bookings()');

        const resp = await this.booking.getAllBookings(GetAllBookingsRequest);

        return resp.bookings.map((b): BookingModel => ({
            id: b.id,
            user_id: b.userId,
            room_id: b.roomId,
            date_from: new Date(b.dateFrom),
            date_to: new Date(b.dateTo),
            status: mapGrpcStatus(b.status),
            created_at: new Date(b.createdAt),
        }));
    }
}