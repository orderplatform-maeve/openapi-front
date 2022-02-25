import axios from 'axios';
import endpoints from '@apis/endpoints';

// 노출 상태 -> 제한 노출로 변경
export const postCategoryUpdateCategoryScheduleOff = async (config) => {
  const url = `${endpoints.category.updateCategoryScheduleOff}`;
  const res = await axios.post(url, config.body);

  return res;
};

// 노출 상태 -> 항상 노출로 변경
export const postCategoryUpdateCategoryScheduleOn = async (config) => {
  const url = `${endpoints.category.updateCategoryScheduleOn}`;
  const res = await axios.post(url, config.body);
  return res;
};

// 노출 시간 선택
export const postCategoryUpdateCategoryTime =  async (config) => {
  const url = `${endpoints.category.updateCategoryTime}`;
  const res = await axios.post(url, config.body);

  return res;
};

export default {
  postCategoryUpdateCategoryScheduleOff,
  postCategoryUpdateCategoryScheduleOn,
  postCategoryUpdateCategoryTime
};