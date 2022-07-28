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

export const getTableCreditStatList = (storeCode) => {
  const url = `${endpoints.payment.tableCreditStatList}?storeCode=${storeCode}`;
  const res = axios.get(url);

  return res;
};

export const getTableCreditInfo = (storeCode, tableName, tableId) => {
  const url = `${endpoints.payment.tableCreditInfo}?storeCode=${storeCode}&tableName=${tableName}&tableId=${tableId}`;
  const res = axios.get(url);

  return res;
};

export const getCreditOrderKeyList = (storeCode, orderKey) => {
  const url = `${endpoints.payment.creditOrderKeyList}?storeCode=${storeCode}&orderkey=${orderKey}`;
  const res = axios.get(url);

  return res;
};


export default {
  requestMisuCommit,
  requestCardCancelCommit,
  getTableCreditStatList,
  getTableCreditInfo,
  getCreditOrderKeyList,
};
