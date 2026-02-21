import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse();

      message =
        typeof res === 'string'
          ? res
          : (res as any).message ?? message;

      if (statusCode >= 500) {
        this.logger.error(
          `${request.method} ${request.url} → ${statusCode} | ${message}`,
          exception.stack,
        );
      } else {
        this.logger.warn(
          `${request.method} ${request.url} → ${statusCode} | ${message}`,
        );
      }
    } else {
      this.logger.error(
        `${request.method} ${request.url} → 500 | Unhandled exception`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(statusCode).json({
      statusCode,
      message,
    });
  }
}