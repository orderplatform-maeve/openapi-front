export const vaildShopCode = (state, order) => {
  const isStateCode = state.auth && state.auth.store && state.auth.store.code;
  const isShopCode = order && order.shop_code;

  const isTrueCode = isStateCode && isShopCode;
  const isMatchShopCode = state.auth.store.code === order.shop_code;

  const isTrue = isTrueCode && isMatchShopCode;

  return isTrue;
};
