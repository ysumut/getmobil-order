import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { GeneralResponseDto } from '../dtos/general-response.dto';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    Logger.error(exception);
    if (exception.name == 'NotFoundError') {
      return response
        .status(HttpStatus.OK)
        .json(
          new GeneralResponseDto(false).setMessages([
            'İlgili veri bulunamadı.',
          ]),
        );
    }
    return response
      .status(HttpStatus.OK)
      .json(
        new GeneralResponseDto(false).setMessages([
          'Beklenmedik bir sorun oluştu.',
        ]),
      );
  }
}
