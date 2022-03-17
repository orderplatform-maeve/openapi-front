import axios from 'axios';
import endpoints from '@apis/endpoints';

export const postOrderConfirm = async (data) => {
  const url = endpoints.orders.orderReceive;
  const res = await axios.post(url, data);

  return res;
};

export default {
  postOrderConfirm
};
