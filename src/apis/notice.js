import axios from 'axios';
import endpoints from '@apis/endpoints';

export const getNoticeInfo = async (query) => {
  const url = `${endpoints.notice.info}?${query}`;

  const res = await axios.get(url);

  return res;
};

export const getDetailNoticeInfo = async (query) => {
  const url = `${endpoints.notice.info}/${query}`;

  const res = await axios.get(url);

  return res;
};

export const getNoticePopup = async () => {
  const url = endpoints.notice.popup;

  const res = await axios.get(url);

  return res;
};

export const postNoticeMessage = async (data) => {
  const url = endpoints.notice.message;
  const res = await axios.post(url, data);

  return res;
};

export default {
  getNoticeInfo,
  getDetailNoticeInfo,
  getNoticePopup,
  postNoticeMessage,
};
