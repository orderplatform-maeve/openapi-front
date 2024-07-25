import { postRequestApi } from '@utils/axiosUtils';
import endpoints from '@apis/endpoints';

export const postMessage = (storeCode, phoneNumber) => {
  const url = `${endpoints.happyTalk.postMessage}/${storeCode}`;
  const fd = new FormData();

  fd.append('phone', phoneNumber);

  const res = postRequestApi(url, fd);
  return res;
};

export default {
  postMessage,
};
