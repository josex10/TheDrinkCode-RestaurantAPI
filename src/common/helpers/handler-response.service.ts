import { HttpException, Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { IResponseSuccess } from '../models';

@Injectable()
export class HandlerResponseService {
  handleError = (error: any, path = 'App Logger') => {
    const logger = new Logger(path);
    logger.error(error);

    let code = 500;
    let message = 'Internal Server Error';
    if (error.status) {
      code = error.status;
    }

    if (error.message) {
      message = error.message;
    }

    throw new HttpException(
      {
        errorResponse: {
          timestamp: new Date(),
          path,
          code,
          message,
        },
      },
      code,
    );
  };

  handleSuccess = (data: any, code: number, path = 'App'): IResponseSuccess => {
    return {
      successResponse: {
        timestamp: new Date(),
        path,
        data,
        code,
      },
    };
  };
}
