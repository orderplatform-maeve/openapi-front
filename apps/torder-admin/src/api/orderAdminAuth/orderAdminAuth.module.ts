import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { OrderAdminAuthGuard } from '@/api/orderAdminAuth/orderAdminAuth.guard';
import OrderAdminAuthFetch from '@/api/orderAdminAuth/orderAdminAuth.fetch';

@Module({
  controllers: [],
  providers: [
    OrderAdminAuthFetch,
    {
      provide: APP_GUARD,
      useClass: OrderAdminAuthGuard,
    },
  ],
})
export class OrderAdminAuthModule {}
