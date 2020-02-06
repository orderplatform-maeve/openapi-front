// export const vaildShopCodeOrigins = (state, order) => {
//   const isStateCode = state.auth && state.auth.store && state.auth.store.store_code;
//   const isShopCode = order && order.shop_code;

//   const isTrueCode = isStateCode && isShopCode;
//   const isMatchShopCode = state.auth.store.store_code === order.shop_code;

//   const isTrue = isTrueCode && isMatchShopCode;

//   return isTrue;
// };

export const vaildShopCode = (state, order) => {
  const isStateCode = state.auth?.store?.store_code;

  const isShopCode = order?.shop_code;

  const isTrueCode = isStateCode && isShopCode;
  const isMatchShopCode = state.auth.store.store_code === order.shop_code;

  const isTrue = isTrueCode && isMatchShopCode;

  return isTrue;
};
