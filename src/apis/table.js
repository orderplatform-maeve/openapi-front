import { customAxios } from "@utils/customAxios";
import endpoints from '@apis/endpoints';
import querystring from "querystring";

export const requestTableList = async (params) => {
  const queryData = querystring.stringify(params);

  const url = `${endpoints.table.getTableList}?${queryData}`;
  const res =  await customAxios().get(url, params);

  return res;
};

export const requestCartList = async (params) => {
  const url = endpoints.table.getCartList;
  const res =  await customAxios().post(url, params);

  return res;
};

export const requestOrder = async (params, config) => {
  const url = endpoints.table.order;
  const res =  await customAxios().post(url, params, config);

  return res;
};

export default {
  requestTableList,
  requestCartList
};
