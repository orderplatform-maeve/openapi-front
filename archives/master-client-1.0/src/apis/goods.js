import { customAxios } from "@utils/customAxios";
import endpoints from './endpoints';

// 옵션 그룹 [필수]에 적합하게 설정했는지 체크 요청
export const postOptionSaleOffCheck = (options) => {
  const url = endpoints.goods.optionSaleOffCheck;
  const res = customAxios().post(url, options);

  return res;
};

export const postOptionSaleOffSubmit = (options) => {
  const url = endpoints.goods.optionSaleOffSubmit;
  const res = customAxios().post(url, options);

  return res;
};

export const getUpdateGoodStatus = (options) => {
  const url = endpoints.goods.updateGoodStatus;
  const res = customAxios().get(url, options);

  return res;
};


export default {
  postOptionSaleOffCheck,
  postOptionSaleOffSubmit,
  getUpdateGoodStatus
};
