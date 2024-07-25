import requestApi from '@utils/axiosUtils';
import endpoints from '@apis/endpoints';

export const postOrderConfirm = async (data) => {
  const url = endpoints.orders.orderReceive;
  const res = await requestApi.post(url, data);

  return res;
};

export default {
  postOrderConfirm
};
