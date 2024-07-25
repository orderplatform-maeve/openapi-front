import requestApi from '@utils/axiosUtils';
import endpoints from '@apis/endpoints';

export const postShopConfigData = async (param) => {
  const url = endpoints.shop.config;
  return await requestApi.post(url, param);
};

export default {
  postShopConfigData
};
