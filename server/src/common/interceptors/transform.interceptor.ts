import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type StandardResponse<T = unknown> = {
  code: string;
  data: T;
  msg: string;
};

function isStandardResponse(value: unknown): value is StandardResponse {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return typeof v.code === 'string' && typeof v.msg === 'string' && 'data' in v;
}

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (isStandardResponse(data)) {
          return data;
        }
        return {
          code: '0000', // 与前端 VITE_SERVICE_SUCCESS_CODE 保持一致
          data,
          msg: 'success',
        };
      }),
    );
  }
}
