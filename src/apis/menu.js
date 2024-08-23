import endpoints from "@apis/endpoints";
import { customAxios } from "@utils/customAxios";

export const postCategoryList = (params) => {
  const url = endpoints.menu.categories;

  const res = customAxios().post(url, params);
  return res;
};

export const postGetGoodsList = (params) => {
  const url = endpoints.menu.getGoodsList;

  const res = customAxios().post(url, params);
  return res;
};

export const postCategoryOpen = (params) => {
  const url = endpoints.menu.updateCategoryOpen;

  const res = customAxios().post(url, params);
  return res;
};

export const postCategoryClose = (params) => {
  const url = endpoints.menu.updateCategoryClose;

  const res = customAxios().post(url, params);
  return res;
};

export const postAllCategories = (params) => {
  const url = endpoints.menu.getAllCategories;

  const res = customAxios().post(url, params);
  return res;
};

export const postGetMenuConfig = (params) => {
  const url = endpoints.menu.getMenuConfig;
  const config = {
    headers: { 'Content-Type': 'multipart/form-data' },
  };

  const res = customAxios().post(url, params, config);
  return res;
};

export default {
  postCategoryList,
  postGetGoodsList,
  postCategoryOpen,
  postCategoryClose,
  postAllCategories,
  postGetMenuConfig
};
