import { Module } from '@nestjs/common';
import { ProductImageManageService } from '@/api/productImageManage/productImageManage.service';
import { ProductImageManageController } from '@/api/productImageManage/productImageManage.controller';

@Module({
  controllers: [ProductImageManageController],
  providers: [ProductImageManageService],
})
export class ProductImageManageModule {}
