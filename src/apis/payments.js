import axios from 'axios';
import endpoints from '@apis/endpoints';

export const requestMisuCommit = async (orderKey) => {
  const url = endpoints.payment.misuCommit;
  const fd = new FormData();
  fd.append('orderkey', orderKey);

  const res = await axios.post(url, fd);

  return res;
};

export const requestCardCancelCommit = async (params) => {
  const url = endpoints.payment.cardCancelCommit;
  const res = await axios.post(url, JSON.stringify(params));
  return res;
};

export default {
  requestMisuCommit,
  requestCardCancelCommit,
};
