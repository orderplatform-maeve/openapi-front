import { Reflector } from '@nestjs/core';
import { Injectable, CanActivate, ExecutionContext, Scope } from '@nestjs/common';
import { TOrderAdminAuthPage } from '@/api/orderAdminAuth/orderAdminAuth.types';
import OrderAdminAuthFetch from '@/api/orderAdminAuth/orderAdminAuth.fetch';
import { hasOrderAdminApiResponseData } from '@/api/api.type';

/**
 * (구) order admin 에서 관리하는 권한 체크
 * - 9, 10, 1004
 * - 신규 권한 시스템으로 변경 예정
 *
 * 페이지 접근 권한 존재 여부를 체크하는 가드
 */
@Injectable({ scope: Scope.REQUEST })
export class OrderAdminAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly orderAdminAuthFetch: OrderAdminAuthFetch,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const orderAdminAuthRole = this.reflector.get<TOrderAdminAuthPage>('orderAdminAuthPage', context.getHandler());
    /**
     * orderAdminAuthRole 이 없는 경우 권한 불필요 페이지(eg. 로그인) 로 간주하고
     * 권한을 확인하지 않음
     */
    if (!orderAdminAuthRole) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    /**
     * cookie 에 jwt 가 없는 경우 접근 불가
     */
    if (!request.cookies.jwt) {
      return false;
    }

    const healthCheck = await this.orderAdminAuthFetch.healthCheck();
    /**
     * health check 응답이 정상이 아닌 경우
     */
    if (!hasOrderAdminApiResponseData(healthCheck)) {
      return false;
    }

    const authInfo = await this.orderAdminAuthFetch.getAuthInfo(healthCheck.data.t_order_auth);
    /**
     * token info 조회 - 오류 발생한 경우
     */
    if (!hasOrderAdminApiResponseData(authInfo)) {
      return false;
    }

    /**
     * T_order_MGroup_page_auth 에 페이지 코드가 포함되어 있어야 접근 가능
     */
    return authInfo.data.T_order_MGroup_page_auth.includes(orderAdminAuthRole);
  }
}
