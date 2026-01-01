import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let code = String(status);
    let msg = 'Request failed';
    const data = null;

    if (status === HttpStatus.UNAUTHORIZED) {
      code = '8888'; // Frontend logout code
      msg = 'Unauthorized';
    } else if (typeof exceptionResponse === 'object') {
        const res = exceptionResponse as any;
        msg = Array.isArray(res.message) ? res.message.join(', ') : res.message;
        // Keep original code if it exists, otherwise use status
        code = res.code || String(status);
    } else {
        msg = exceptionResponse as string;
    }

    response.status(200).json({
      code,
      data,
      msg,
    });
  }
}
