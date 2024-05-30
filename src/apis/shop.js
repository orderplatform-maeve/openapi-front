import axios from 'axios';
import endpoints from '@apis/endpoints';

export const postShopConfigData = async (param) => {
  const url = endpoints.shop.config;
  return await axios.post(url, param);
};

export default {
  postShopConfigData
};
