import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import {UsersService} from "../users.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private usersService: UsersService) {
    }

    async intercept(context: ExecutionContext, handler: CallHandler) {
        const request = context.switchToHttp().getRequest();
        const session = request.session;
        if (session) {
            const userId = session.userId || null;
            if (userId) {
                request.currentUser = await this.usersService.findOne(userId);
            }
        }
        return handler.handle();
    }

}