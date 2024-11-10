import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { GeneralResponseDto } from '../dtos/general-response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response
      .status(
        [HttpStatus.UNAUTHORIZED].includes(exception.getStatus())
          ? exception.getStatus()
          : HttpStatus.OK,
      )
      .json(new GeneralResponseDto(false).setMessages([exception.message]));
  }
}
