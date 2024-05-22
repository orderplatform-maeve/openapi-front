import axios from 'axios';
import endpoints from '@apis/endpoints';

export const postMessage = (storeCode, phoneNumber) => {
  const url = `${endpoints.happyTalk.postMessage}/${storeCode}`;
  const fd = new FormData();

  fd.append('phone', phoneNumber);

  const res = axios.post(url, fd);
  return res;
};

export default {
  postMessage,
};
