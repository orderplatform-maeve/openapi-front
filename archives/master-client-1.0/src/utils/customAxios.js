import axios from 'axios';
import { IS_UPLUS } from "@utils/constants";

const tokenAxios = axios.create();

tokenAxios.interceptors.request.use((config) => {
  // saas 의 경우에만 token 인증
  if (IS_UPLUS) {
    const accessToken = localStorage.getItem('jwt');
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

const baseAxios = axios.create();

baseAxios.interceptors.request.use((config) => config);

export const customAxios = () => {
  // saas 의 경우에만 token 인증
  if (IS_UPLUS) {
    return tokenAxios;
  }
  return baseAxios;
};

export default customAxios;
