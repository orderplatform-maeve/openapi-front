import { getRequestApi, postRequestApi } from '@utils/axiosUtils';
import endpoints from '@apis/endpoints';

export const postCardCancelCommit = async (params) => {
  const url = endpoints.payment.cardCancelCommit;
  const res = await postRequestApi(url, JSON.stringify(params));
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

  const res = await postRequestApi(url, fd, ...config);

  return res;
};

export const getPaymentCreditList = async (params) => {
  const url = endpoints.payment.creditList;

  const res = await getRequestApi(url, {params});
  return res;
};

export const getPaymentCreditDataList = async (params) => {
  const url = endpoints.payment.creditDataList;

  const res = await getRequestApi(url, {params});
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

  const res = await postRequestApi(url, fd, ...config);

  return res;
};

export const postPaymentMisuCommit = async (orderKey) => {
  const url = endpoints.payment.misuCommit;
  const fd = new FormData();
  fd.append('orderkey', orderKey);

  const res = await postRequestApi(url, fd);

  return res;
};

export const getTableCreditStatList = async (storeCode) => {
  const url = `${endpoints.payment.tableCreditStatList}?storeCode=${storeCode}`;
  const res = await getRequestApi(url);

  return res;
};

export const getTableCreditInfo = async (storeCode, tableName, tableId) => {
  const url = `${endpoints.payment.tableCreditInfo}?storeCode=${storeCode}&tableName=${tableName}&tableId=${tableId}`;
  const res = await getRequestApi(url);

  return res;
};

export const getCreditOrderKeyList = async (storeCode, orderKey) => {
  const url = `${endpoints.payment.creditOrderKeyList}?storeCode=${storeCode}&orderkey=${orderKey}`;
  const res = await getRequestApi(url);

  return res;
};


export default {
  postPaymentCashCommit,
  getPaymentCreditList,
  postCardCancelCommit,
  postPaymentMisuCommit,
  getTableCreditStatList,
  getTableCreditInfo,
  getCreditOrderKeyList,
};
