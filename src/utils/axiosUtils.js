import axios from 'axios';
import { getCookie } from "@utils/cookieUtils";
import { IS_LG_FLAG } from "@utils/constants";

const config = (url) =>  {
  return {
    baseURL: url,
    withCredentials: true,
  };
};

const requestApi = axios.create(config);

if(IS_LG_FLAG) {
  console.log('실행돰');
  requestApi.interceptors.request.use((configOrigin) => {
    const cfg = configOrigin;
    const token = getCookie('jwt');

    console.log(token);

    cfg.headers.Authorization = `Bearer ${token}`;
    cfg.validateStatus = (status) => status === 200;
    return cfg;
  });
}

export default requestApi;

