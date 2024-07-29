import { customAxios } from "@utils/customAxios";
import endpoints from '@apis/endpoints';

export const postCardCancelCommit = async (params) => {
  const url = endpoints.payment.cardCancelCommit;

  const res = await customAxios().post(url, JSON.stringify(params));
  return res;
};

export const postPaymentCashCommit = async (params) => {
  const url = endpoints.payment.cashCommit;

  const fd = new FormData();
  fd.append('key', params.key);
  fd.append('id', params.id);
  fd.append('stat', params.creditStat);
  fd.append('type',  params.creditType);
  fd.append('storeCode', params.storeCode);
  fd.append('tabletNumber', params.tabletnumber);
  fd.append('tablename', params.tableName);
  fd.append('orderKey', params.orderkey);

  const config = {
    headers: { "Content-Type": "multipart/form-data" }
  };

  const res = await customAxios().post(url, fd, ...config);

  return res;
};

export const getPaymentCreditList = async (params) => {
  const url = endpoints.payment.creditList;

  const res = await customAxios().get(url, {params});
  return res;
};

export const getPaymentCreditDataList = async (params) => {
  const url = endpoints.payment.creditDataList;

  const res = await customAxios().get(url, {params});
  return res;
};

export const postPaymentCashCancelCommit = async (params) => {
  const url = endpoints.payment.cashCancelCommit;

  const fd = new FormData();
  fd.append('key', params.key);
  fd.append('id', params.id);
  fd.append('stat', params.creditStat);
  fd.append('type',  params.creditType);
  fd.append('storeCode', params.storeCode);
  fd.append('tabletNumber', params.tabletnumber);
  fd.append('tablename', params.tableName);
  fd.append('orderKey', params.orderkey);

  const config = {
    headers: { "Content-Type": "multipart/form-data" }
  };

  const res = await customAxios().post(url, fd, ...config);

  return res;
};

export const postPaymentDeleteCartList = async (params, storeCode) => {
  const url = endpoints.payment.deleteCartList;

  const fd = new FormData();
  fd.append('store_shop_code', storeCode);
  fd.append('tablet_number', params.Ta_id);

  const res = await customAxios().post(url, fd);

  return res;
};

export const postPaymentMisuCommit = async (orderKey) => {
  const url = endpoints.payment.misuCommit;
  const fd = new FormData();
  fd.append('orderkey', orderKey);

  const res = await customAxios().post(url, fd);

  return res;
};

export const getTableCreditStatList = async (storeCode) => {
  const url = `${endpoints.payment.tableCreditStatList}?storeCode=${storeCode}`;

  const res = await customAxios().get(url);

  return res;
};

export const getTableCreditInfo = async (storeCode, tableName, tableId) => {
  const url = `${endpoints.payment.tableCreditInfo}?storeCode=${storeCode}&tableName=${tableName}&tableId=${tableId}`;

  const res = await customAxios().get(url);

  return res;
};

export const getCreditOrderKeyList = async (storeCode, orderKey) => {
  const url = `${endpoints.payment.creditOrderKeyList}?storeCode=${storeCode}&orderkey=${orderKey}`;

  const res = await customAxios().get(url);

  return res;
};




export default {
  postPaymentCashCommit,
  getPaymentCreditList,
  postCardCancelCommit,
  postPaymentDeleteCartList,
  postPaymentMisuCommit,
  getTableCreditStatList,
  getTableCreditInfo,
  getCreditOrderKeyList,
};
