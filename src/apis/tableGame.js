import axios from 'axios';
import endpoints from './endpoints';

// 현재 모든 매장 조회로 연결 작업 해놓고 추후 API 수정되면 url만 변경할 예정
// 게임 관리 - 진행내역 조회
export const gameProgressHistory = async () => {
  const url = `${endpoints.tableGame.room}`;
  const res = await axios.get(url);

  return res;
};

export default {
  gameProgressHistory,
};