import requestApi from '@utils/axiosUtils';
import endpoints from './endpoints';

// 옵션 그룹 [필수]에 적합하게 설정했는지 체크 요청
export const postOptionSaleOffCheck = (options) => {
  const url = endpoints.goods.optionSaleOffCheck;
  const res = requestApi.post(url, options);

  return res;
};

export const postOptionSaleOffSubmit = (options) => {
  const url = endpoints.goods.optionSaleOffSubmit;
  const res = requestApi.post(url, options);

  return res;
};

export default {
  postOptionSaleOffCheck,
  postOptionSaleOffSubmit
};
