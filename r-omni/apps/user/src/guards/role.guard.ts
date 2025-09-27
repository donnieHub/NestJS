import {CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import {Reflector} from "@nestjs/core";
import {ROLES_KEY} from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    private readonly logger = new Logger(RolesGuard.name);

    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        this.logger.log(`Checking for roles`);

        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            this.logger.log(`If no roles are specified, we allow access`);
            return true;
        }

        const ctx = GqlExecutionContext.create(context);
        const request = ctx.getContext().req;
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('The user is not authenticated');
        }

        const hasRole = requiredRoles.some(role => user.role === role);

        if (!hasRole) {
            throw new ForbiddenException('Insufficient permissions to perform the operation');
        }

        return true;
    }
}