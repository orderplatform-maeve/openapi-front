import { Module } from '@nestjs/common';
import { ProductImageManageModule } from '@/api/productImageManage/productImageManage.module';
import { OrderAdminAuthModule } from '@/api/orderAdminAuth/orderAdminAuth.module';

@Module({
  imports: [OrderAdminAuthModule, ProductImageManageModule],
})
export class ApiModule {}
