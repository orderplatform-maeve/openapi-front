import { postRequestApi } from '@utils/axiosUtils';
import endpoints from '@apis/endpoints';

export const postAuthenticationLogin = async (params) => {
  const url = endpoints.authentication.login;
  const res =  await postRequestApi(url, params);

  return res;
};

export default {
  postAuthenticationLogin
};
