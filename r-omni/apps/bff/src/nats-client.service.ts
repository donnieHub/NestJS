import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class NatsClientService {
    constructor(@Inject('BFF_NATS_SERVICE') private readonly client: ClientProxy) {}

    send<TResult = any, TInput = any>(
        pattern: string,
        data: TInput,
    ): Observable<TResult> {
        return this.client.send<TResult, TInput>(pattern, data);
    }

    emit<TResult = any, TInput = any>(
        pattern: string,
        data: TInput,
    ): Observable<TResult> {
        return this.client.emit<TResult, TInput>(pattern, data);
    }
}