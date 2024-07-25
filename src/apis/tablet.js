import endpoints from "@apis/endpoints";
import { postRequestApi } from "@utils/axiosUtils";

const postTabletAllRefresh = async (data) => {
  const url = endpoints.tablet.allRefresh;
  const res = await postRequestApi(url, data);

  return res;
};

const postTabletRefresh = async (data) => {
  const url = endpoints.tablet.refresh;
  const res = await postRequestApi(url, data);

  return res;
};

const postTabletResetOrder = async (data) => {
  const url = endpoints.tablet.resetOrder;
  const res = await postRequestApi(url, data);

  return res;
};

export default {
  postTabletAllRefresh,
  postTabletRefresh,
  postTabletResetOrder
};
