import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { UsersService } from '../users.service';
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {
    // console.log('usersService', usersService);
  }
  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session;

    if (userId) {
      const user = await this.usersService.findOne(userId);
      request.currentUser = user;
      console.log(request.currentUser);
    }

    return handler.handle();
  }
}
