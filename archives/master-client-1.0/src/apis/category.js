import { customAxios } from "@utils/customAxios";
import endpoints from '@apis/endpoints';

// 노출 상태 -> 제한 노출로 변경
export const postCategoryUpdateCategoryScheduleOff = async (config) => {
  const url = endpoints.category.updateCategoryScheduleOff;

  const res = await customAxios().post(url, config.body);
  return res;
};

// 노출 상태 -> 항상 노출로 변경
export const postCategoryUpdateCategoryScheduleOn = async (config) => {
  const url = endpoints.category.updateCategoryScheduleOn;

  const res = await customAxios().post(url, config.body);
  return res;
};

// 노출 시간 선택
export const postCategoryUpdateCategoryTime =  async (config) => {
  const url = endpoints.category.updateCategoryTime;

  const res = await customAxios().post(url, config.body);
  return res;
};

// 노출 요일 선택
export const postCategoryUpdateCategoryScheduleDateArray =  async (config) => {
  const url = endpoints.category.updateCategoryScheduleDateArray;

  const res = await customAxios().post(url, config.body);
  return res;
};

// 노출시간 이후 표시여부 -> '분류 숨김' 으로 변경
export const postCategoryUpdateCategoryHide =  async (config) => {
  const url = endpoints.category.updateCategoryHide;

  const res = await customAxios().post(url, config.body);
  return res;
};

// 노출시간 이후 표시여부 -> '분류 표시' 로 변경
export const postCategoryUpdateCategoryShow =  async (config) => {
  const url = endpoints.category.updateCategoryShow;

  const res = await customAxios().post(url, config.body);
  return res;
};


export default {
  postCategoryUpdateCategoryScheduleOff,
  postCategoryUpdateCategoryScheduleOn,
  postCategoryUpdateCategoryTime,
  postCategoryUpdateCategoryScheduleDateArray,
  postCategoryUpdateCategoryHide,
  postCategoryUpdateCategoryShow
};
