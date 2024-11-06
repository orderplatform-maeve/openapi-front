import type { Request } from 'express';
import { AdminBFFBaseClient } from '@torder/client-fetcher/src/admin/AdminBFFBaseClient';
import { REQUEST } from '@nestjs/core';
import { Injectable, Scope, Inject } from '@nestjs/common';
import conf from '@/conf';

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
  async healthCheck() {
    const { data } = await this.instance.post<{ result: boolean }>('/api/etc/health_check', {
      type: 'jwt',
      value: this.jwt,
    });
    return data;
  }
}

export default OrderAdminAuthFetch;
