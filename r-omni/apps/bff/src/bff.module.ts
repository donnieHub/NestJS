import { Module } from '@nestjs/common';
import { BffController } from './bff.controller';
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo";
import {join} from "path";
import {UserResolver} from "./user.resolver";
import {NatsClientService} from "../../r-omni/src/client/nats-client.service";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {BffService} from "./bff.service";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'apps/bff/src/schema.gql'),
      sortSchema: true,
      playground: true,
    }),
    ClientsModule.register([
      {
        name: 'NATS_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: [process.env.NATS_URL ?? 'nats://nats-server:4222'],
        },
      },
    ]),
  ],
  controllers: [BffController],
  providers: [UserResolver, NatsClientService, BffService],
})
export class BffModule {}
