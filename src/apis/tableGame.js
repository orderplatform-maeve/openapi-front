import axios from 'axios';
import endpoints from './endpoints';

// 단일 매장 게임 진행내역 조회
export const gameProgressHistory = async (config) => {
  const url = `${endpoints.tableGame.admin.master.room}/${config.params.storeCode}`;

  const res = await axios.get(url, config);

  return res;
};

export default {
  gameProgressHistory,
};