import axios from 'axios';
import endpoints from '@apis/endpoints';

// updateCategoryScheduleOff
export const postCategoryUpdateCategoryScheduleOff = async (config) => {
  const url = `${endpoints.category.updateCategoryScheduleOff}`;
  const res = await axios.get(url, config);

  return res;
};

// updateCategoryScheduleOn
export const postCategoryUpdateCategoryScheduleOn = async (body) => {
  const url = `${endpoints.category.updateCategoryScheduleOn}`;
  const res = await axios.post(url, body);
  return res;
};

// updateCategoryTime
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