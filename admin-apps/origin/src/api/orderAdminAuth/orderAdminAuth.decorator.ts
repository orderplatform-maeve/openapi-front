import { SetMetadata } from '@nestjs/common';
import { TOrderAdminAuthPage } from '@/api/orderAdminAuth/orderAdminAuth.types';

export const OrderAdminAuthPage = (page: TOrderAdminAuthPage) => SetMetadata('orderAdminAuthPage', page);
