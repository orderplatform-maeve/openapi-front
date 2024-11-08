export const OrderAdminAuthPages = {
  productImageManage: '상품 이미지 일괄 수정',
} as const;

export type TOrderAdminAuthPage = keyof typeof OrderAdminAuthPages;

export interface IOrderAdminAuthHealthCheck {
  t_order_id: string;
  t_order_name: string;
  t_order_auth: number;
  t_order_store_code: string;
  t_order_store_name: string;
}

interface IOrderAdminAuthInfoLnbItem {
  code: string;
  flag: boolean;
  name: string;
  child: IOrderAdminAuthInfoLnbItem[];
}

export interface IOrderAdminAuthInfo {
  T_order_MGroup_code: number;
  T_order_MGroup_name: string;
  T_order_MGroup_page_auth: string[];
  T_order_MGroup_lnb_auth: IOrderAdminAuthInfoLnbItem[];
  T_order_MGroup_function_auth: string[];
}
