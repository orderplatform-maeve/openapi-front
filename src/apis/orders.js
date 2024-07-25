import { postRequestApi } from '@utils/axiosUtils';
import endpoints from '@apis/endpoints';

export const postOrderConfirm = async (data) => {
  const url = endpoints.orders.orderReceive;
  const res = await postRequestApi(url, data);

  return res;
};

export const getTodayRedisData = async (data) => {
  const url = endpoints.orders.todayRedisData;
  const res = await postRequestApi(url, data);

  return res;
};

export const postCommitOrderViewData = async (data, config) => {
  const url = endpoints.orders.commitOrderViewData;

  const fd = new FormData();
  fd.append('shop_code', data.auth.store.store_code);
  fd.append('key', data.order.order_view_key);
  fd.append('commit', !data.order.commit ? 1 : 0);

  const res = await postRequestApi(url, data, config);

  return res;
};

export const postOrdersOrder = async (data) => {
  const url = endpoints.orders.order;
  const res = await postRequestApi(url, data);

  return res;
};

export const postControlLastOrder = async (data) => {
  const url = endpoints.orders.controlLastOrder;
  const res = await postRequestApi(url, data);

  return res;
};

export const postDeleteLastOrder = async (data) => {
  const url = endpoints.orders.deleteLastOrder;
  const res = await postRequestApi(url, data);

  return res;
};

export default {
  postOrderConfirm,
  getTodayRedisData,
  postCommitOrderViewData,
  postOrdersOrder,
  postControlLastOrder,
  postDeleteLastOrder
};
