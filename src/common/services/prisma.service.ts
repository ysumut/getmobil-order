import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { createSoftDeleteExtension } from 'prisma-extension-soft-delete';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();

    this.$extends(
      createSoftDeleteExtension({
        models: {
          Order: true,
          OrderItem: true,
          Product: true,
          ProductVendor: true,
          Vendor: true,
        },
        defaultConfig: {
          field: 'deletedAt',
          createValue: (deleted) => {
            if (deleted) return new Date();
            return null;
          },
        },
      }),
    );
  }

  async onModuleInit() {
    await this.$connect();
  }
}
