import { customAxios } from "@utils/customAxios";
import endpoints from '@apis/endpoints';

export const postMessage = (storeCode, phoneNumber) => {
  const url = `${endpoints.happyTalk.postMessage}/${storeCode}`;
  const fd = new FormData();

  fd.append('phone', phoneNumber);

  const res = customAxios().post(url, fd);
  return res;
};

export default {
  postMessage,
};
