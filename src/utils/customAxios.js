import axios from 'axios';
import { IS_LG } from "@utils/constants";

const tokenAxios = axios.create();

tokenAxios.interceptors.request.use((config) => {
  // lg의 경우에만 token 인증
  if (IS_LG) {
    const accessToken = localStorage.getItem('jwt');
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

const baseAxios = axios.create();

baseAxios.interceptors.request.use((config) => config);

export const customAxios = () => {
  // lg의 경우에만 token 인증
  if (IS_LG) {
    return tokenAxios;
  }
  return baseAxios;
};

export default customAxios;
