import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  ValidationPipe,
} from '@nestjs/common';

@Injectable()
export class ErrorValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const validationPipe = new ValidationPipe({
      transform: true,
    });
    return validationPipe.transform(value, metadata);
  }
}
