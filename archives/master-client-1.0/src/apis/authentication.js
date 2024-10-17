import endpoints from '@apis/endpoints';
import { customAxios } from "@utils/customAxios";

export const postAuthenticationLogin = async (params) => {
  const url = endpoints.authentication.login;
  const res =  await customAxios().post(url, params);

  return res;
};

export default {
  postAuthenticationLogin
};
