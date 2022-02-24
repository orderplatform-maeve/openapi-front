import axios from 'axios';
import endpoints from '@apis/endpoints';

export const getNoticeInfo = async (query) => {
  const url = `${endpoints.notice.getNoticeInfo}?${query}`;

  const res = await axios.get(url, url);

  return res;
};

export const getDetailNoticeInfo = async (query) => {
  const url = `${endpoints.notice.getNoticeInfo}/${query}?noticeCaller=MASTER`;

  const res = await axios.get(url, url);

  return res;
};

export default {
  getNoticeInfo,
  getDetailNoticeInfo
};
