import {PlatformApp} from "@rsdk/core";
import {ExpressHttpTransport} from "@rsdk/http.server.express";
import {GrpcTransport} from "@rsdk/grpc.server";
import bookingPkg from "../../../contracts/grpc/dist/booking.v1";
import {NatsClientPlugin} from "@rsdk/nats.common";
import {BookingModule} from "./booking.module";

function main(): void {
    const app = new PlatformApp({
    modules: [
        BookingModule,
    ],
    transports: [
        // new ExpressHttpTransport({
        //     cors: { origin: '*' },
        //     parsers: {
        //         cookie: true,
        //     },
        // }),
        new GrpcTransport(bookingPkg),
    ],

    plugins: [
        // new NatsClientPlugin(),
    ],
});

app.run();
}

main();
