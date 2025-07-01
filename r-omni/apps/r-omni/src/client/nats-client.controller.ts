import {Controller, Get} from '@nestjs/common';
import {NatsClientService} from "./nats-client.service";

@Controller('user')
export class NatsClientController {
  constructor(private readonly natsClient: NatsClientService) {}

  @Get('get')
  async test() {
    const response = await this.natsClient
        .send('users.findOne', 1)
        .toPromise();
    console.log(`NatsClientController: ${response}`);

    return response;
  }
}