import {CallHandler, ExecutionContext, Inject, Injectable, Logger, NestInterceptor} from "@nestjs/common";
import {ClientProxy, RpcException} from "@nestjs/microservices";
import {firstValueFrom} from "rxjs";
import {User} from "../../../user/src/entities/users.entity";

@Injectable()
export class UserAttachInterceptor implements NestInterceptor {
    private readonly logger = new Logger(UserAttachInterceptor.name);
    constructor(
        @Inject('BOOKING_SERVICE') private readonly natsClient: ClientProxy,
    ) {

    }

    async intercept(context: ExecutionContext, next: CallHandler) {
        this.logger.log('UserAttachInterceptor was called');
        const data = context.switchToRpc().getData();
        const user: User | null = await firstValueFrom(
            this.natsClient.send('user.validate', { sub: data.user_id }),
        );

        if (!user) {
            throw new RpcException({ status: 404, message: 'User not found' });
        }

        data.user = user; // обогащаем payload

        return next.handle();
    }
}
