import { Controller, Get } from '@nestjs/common';
import { ProductImageManageService } from '@/api/productImageManage/productImageManage.service';
import { OrderAdminAuthPage } from '@/api/orderAdminAuth/orderAdminAuth.decorator';

@Controller('productImageManage')
export class ProductImageManageController {
  constructor(private productImageManageService: ProductImageManageService) {}

  @Get()
  @OrderAdminAuthPage('productImageManage')
  async findAll() {
    return this.productImageManageService.findAll();
  }
}
