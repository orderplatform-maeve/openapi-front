import axios from 'axios';
import endpoints from '@apis/endpoints';

export const getNoticeInfo = async (query) => {
  const url = `${endpoints.notice.getNoticeInfo}?${query}`;

  const res = await axios.get(url);

  return res;
};

export const getDetailNoticeInfo = async (query) => {
  const url = `${endpoints.notice.getNoticeInfo}/${query}`;

  const res = await axios.get(url);

  return res;
};

export const getNoticePopup = async () => {
  const url = endpoints.notice.getNoticePopup;

  const res = await axios.get(url);

  return res;
};

export default {
  getNoticeInfo,
  getDetailNoticeInfo,
  getNoticePopup,
};
