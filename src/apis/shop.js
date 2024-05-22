import axios from 'axios';
import endpoints from '@apis/endpoints';

export const postShopConfigData = async (param) => {
  console.log('config call');
  const url = endpoints.shop.config;
  return await axios.post(url, param);
};

export default {
  postShopConfigData
};
