import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}

  async getProducts() {
    const products = await this.prismaService.product.findMany({
      select: {
        id: true,
        name: true,
        productVendors: {
          select: {
            quantity: true,
            price: true,
            taxRate: true,
            discountRate: true,
            vendor: { select: { id: true, name: true } },
          },
        },
      },
    });
    for (const product of products) {
      for (const productVendor of product.productVendors) {
        productVendor['realPrice'] = this.getRealPrice(
          productVendor.price,
          productVendor.taxRate,
          productVendor.discountRate,
        );
        delete productVendor.price;
        delete productVendor.taxRate;
        delete productVendor.discountRate;
      }
    }
    return products;
  }

  getRealPrice(price: number, taxRate: number, discountRate: number): number {
    const taxedPrice = price * ((100 + taxRate) / 100);
    return taxedPrice * ((100 - discountRate) / 100);
  }
}
