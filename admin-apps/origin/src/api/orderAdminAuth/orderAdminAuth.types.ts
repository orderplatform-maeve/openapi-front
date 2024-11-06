export const OrderAdminAuthPages = {
  productImageManage: '상품 이미지 일괄 수정',
} as const;

export type TOrderAdminAuthPage = keyof typeof OrderAdminAuthPages;
