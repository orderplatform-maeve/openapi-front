import { postRequestApi } from '@utils/axiosUtils';
import endpoints from '@apis/endpoints';

export const requestShopConfigData = async (param) => {
  const url = endpoints.shop.config;
  const res =  await postRequestApi(url, param);

  return res;
};

export const requestShopStoreList = async (param) => {
  const url = endpoints.shop.storeList;

  const fd = new FormData();
  fd.append('member_id', param.member.code);

  const res =  await postRequestApi(url, param);

  return res;
};

export default {
  requestShopConfigData
};
