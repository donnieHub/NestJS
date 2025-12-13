import {PlatformApp} from "@rsdk/core";
import {BffModule} from "./bff.module";
import {NatsClientPlugin} from "@rsdk/nats.common";
import {GrpcTransport} from "@rsdk/grpc.server";
import bookingPkg from '../../../contracts/grpc/dist/booking.v1';
import {ExpressHttpTransport} from "@rsdk/http.server.express";
import {GraphQLPlugin} from "@rsdk/graphql";
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import {NatsJetstreamTransport} from "@rsdk/nats.transport";


export const app = new PlatformApp({
  modules: [
    BffModule
  ],
  transports: [
    new ExpressHttpTransport({
      cors: { origin: '*' },
      parsers: {
        cookie: true,
      },
    }),
    new GrpcTransport(bookingPkg),
    // new NatsJetstreamTransport(),
  ],

  plugins: [
    new GraphQLPlugin({
      approach: 'code-first',
      autoSchemaFile: './graphql/schema.graphql',
      // middleware: [graphqlUploadExpress()],
      path: '/graphql',
    }),
    new NatsClientPlugin(),
],
});

app.run();