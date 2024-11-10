import { Logger } from '@nestjs/common';

export class ErrorLogDto {
  private readonly userId: number;
  private readonly payload: object;
  private readonly functionName: string;
  private readonly message: string;
  private readonly createdAt: object;

  constructor(
    userId: number,
    payload: object,
    functionName: string,
    message: string,
  ) {
    this.userId = userId;
    this.payload = payload;
    this.functionName = functionName;
    this.message = message;
    this.createdAt = new Date();
  }

  log(logger: Logger): void {
    logger.error(JSON.stringify(this, null, 2));
  }
}
