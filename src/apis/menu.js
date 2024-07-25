import endpoints from "@apis/endpoints";
import { postRequestApi } from "@utils/axiosUtils";

export const postCategoryList = (params) => {
  const url = endpoints.menu.categories;

  const res = postRequestApi(url, params);
  return res;
};

export const postGetGoodsList = (params) => {
  const url = endpoints.menu.getGoodsList;

  const res = postRequestApi(url, params);
  return res;
};

export const postCategoryOpen = (params) => {
  const url = endpoints.menu.updateCategoryOpen;

  const res = postRequestApi(url, params);
  return res;
};

export const postCategoryClose = (params) => {
  const url = endpoints.menu.updateCategoryClose;

  const res = postRequestApi(url, params);
  return res;
};

export const postAllCategories = (params) => {
  const url = endpoints.menu.getAllCategories;

  const res = postRequestApi(url, params);
  return res;
};

export const postGetMenuConfig = (params) => {
  const url = endpoints.menu.getMenuConfig;
  const config = {
    headers: { 'Content-Type': 'multipart/form-data' },
  };

  const res = postRequestApi(url, params, config);
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
