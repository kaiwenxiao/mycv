import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common/decorators';
import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import { UserDto } from './../users/dto/use.dto';

interface ClassConstructor {
  new (...args: any[]): Record<any, any>;
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // Run something before a request is handled
    // by the request handler

    return handler.handle().pipe(
      map((data: any) => {
        // Run something before the response is sent out

        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
