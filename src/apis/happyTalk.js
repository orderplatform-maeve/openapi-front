import axios from 'axios';
import endpoints from '@apis/endpoints';

export const postMessage = (storeCode, phoneNumber) => {
  const url = `${endpoints.happyTalk.postMessage}/${storeCode}`;
  const data = {
    "receiverNum": phoneNumber,
  };

  const res = axios.post(url, data);
  return res;
};

export default {
  postMessage,
};
