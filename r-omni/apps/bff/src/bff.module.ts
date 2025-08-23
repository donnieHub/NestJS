import { Module } from '@nestjs/common';
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo";
import {join} from "path";
import {UserResolver} from "./user.resolver";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {NatsClientService} from "./nats-client.service";
import {ConfigModule} from "@nestjs/config";
import {DateTimeScalar} from "./model/date.time.scalar";

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'apps/bff/src/schema.gql'),
      sortSchema: true,
      playground: true,
    }),
    ClientsModule.register([
      {
        name: 'BFF_NATS_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: [process.env.BFF_NATS_URL ?? 'nats://nats-server:4222'],
        },
      },
    ]),
  ],
  controllers: [],
  providers: [UserResolver, NatsClientService, DateTimeScalar],
})
export class BffModule {}
