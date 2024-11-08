import type { Request } from 'express';
import { AdminBFFBaseClient } from '@torder/client-fetcher/src/admin/AdminBFFBaseClient';
import { REQUEST } from '@nestjs/core';
import { Injectable, Scope, Inject } from '@nestjs/common';
import conf from '@/conf';
import { IOrderAdminAuthHealthCheck, IOrderAdminAuthInfo } from '@/api/orderAdminAuth/orderAdminAuth.types';
import { TOrderAdminApiResponse } from '@/api/api.type';

@Injectable({ scope: Scope.REQUEST })
class OrderAdminAuthFetch {
  private readonly instance;
  private readonly jwt;

  constructor(@Inject(REQUEST) private request: Request) {
    this.jwt = this.request.cookies.jwt;
    this.instance = new AdminBFFBaseClient({
      baseURL: conf.ADMIN_API_URL,
      jwt: this.request.cookies.jwt,
    });
  }

  async getAuthInfo(authCode: number) {
    const { data } = await this.instance.post<TOrderAdminApiResponse<IOrderAdminAuthInfo>>(
      '/api/auth/torder_auth_info',
      { T_order_MGroup_code: authCode },
    );
    return data;
  }

  async healthCheck() {
    const { data } = await this.instance.post<TOrderAdminApiResponse<IOrderAdminAuthHealthCheck>>(
      '/api/etc/health_check',
      {
        type: 'jwt',
        value: this.jwt,
      },
    );
    return data;
  }
}

export default OrderAdminAuthFetch;
