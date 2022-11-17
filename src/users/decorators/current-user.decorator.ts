import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// 这个装饰器作用是使得Service Controller Entity可以使用Session
export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  },
);
