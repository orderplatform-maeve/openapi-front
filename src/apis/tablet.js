import endpoints from "@apis/endpoints";
import { customAxios } from "@utils/customAxios";

export const postTabletAllRefresh = async (data) => {
  const url = endpoints.tablet.allRefresh;
  const res = await customAxios().post(url, data);

  return res;
};

export const postTabletRefresh = async (data) => {
  const url = endpoints.tablet.refresh;
  const res = await customAxios().post(url, data);

  return res;
};

export const postTabletResetOrder = async (data) => {
  const url = endpoints.tablet.resetOrder;
  const res = await customAxios().post(url, data);

  return res;
};

export default {
  postTabletAllRefresh,
  postTabletRefresh,
  postTabletResetOrder
};
