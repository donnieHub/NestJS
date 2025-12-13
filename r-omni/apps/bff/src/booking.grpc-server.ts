import { GrpcServers } from '@rsdk/grpc.clients';
import {BookingServiceDefinition} from "../../../contracts/grpc/dist/booking/v1/booking";

const SERVER_NAME = 'r-omni_booking';

export const bookingServer = GrpcServers.defineForServer(SERVER_NAME, {
    booking: BookingServiceDefinition,
});
