import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { CreateInvoiceDto } from '../dtos/create-invoice.dto';
import { ErrorLogDto } from '../../common/dtos/error-log.dto';
import { UserDto } from '../../common/dtos/user.dto';

@Injectable()
export class OrderFetchService {
  private readonly logger = new Logger(OrderFetchService.name);
  private readonly invoiceUrl: string;
  private readonly config: AxiosRequestConfig;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.invoiceUrl = this.configService.getOrThrow<string>(
      'MICROSERVICE_INVOICE_URL',
    );
    this.config = {
      headers: {
        'MICROSERVICE-SECURITY-KEY': this.configService.getOrThrow<string>(
          'MICROSERVICE_SECURITY_KEY',
        ),
      },
    };
  }

  async createInvoice(
    user: UserDto,
    dto: CreateInvoiceDto,
    bearerToken: string,
  ): Promise<void> {
    const url = this.invoiceUrl + '/invoices';
    this.config.headers.authorization = bearerToken;
    let res: AxiosResponse;
    try {
      res = await this.httpService.axiosRef.post(url, dto, this.config);
      if (!res?.data?.status) {
        throw new Error(res?.data);
      }
    } catch (error) {
      new ErrorLogDto(
        user.id,
        {
          dto: dto,
          bearerToken: bearerToken,
          error: error,
        },
        this.createInvoice.name,
        'Fatura oluşturulamadı',
      ).log(this.logger);
      throw new BadRequestException('Beklenmedik bir hata oluştu.');
    }
  }
}
