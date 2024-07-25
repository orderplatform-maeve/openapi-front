import { getRequestApi, postRequestApi, putRequestApi } from '@utils/axiosUtils';
import endpoints from './endpoints';

// 단일 매장 게임 진행내역 조회
export const gameProgressHistory = async (config) => {
  const url = `${endpoints.tableGame.admin.master.room}/${config.params.storeCode}`;
  const res = await getRequestApi(url, config);

  return res;
};

// 퀵 메세지 등록, 저장
export const gameQuickMsgSave = async (body) => {
  const url = `${endpoints.tableGame.admin.master.quick}/${body.storeCode}`;
  const res = await postRequestApi(url, body);
  return res;
};

// 퀵 메세지 조회
export const gameQuickMsgLoad =  async (storeCode) => {
  const url = `${endpoints.tableGame.admin.master.quick}/${storeCode}`;
  const res = await getRequestApi(url);

  return res;
};

// 테이블 게임 매장 정보 조회
export const gameStoreInfo = async (storeCode) => {
  const url = `${endpoints.tableGame.admin.store}/${storeCode}`;
  const res = await getRequestApi(url);

  return res;
};

// 각 게임별 상태 정보 조회
export const gamesInfo = async (storeCode) => {
  const url = `${endpoints.tableGame.admin.game}/${storeCode}`;
  const res = await getRequestApi(url);

  return res;
};

// 매장 게임 사용 여부 제어
export const gameUpdateAtStore = async (body) => {
  const url = `${endpoints.tableGame.admin.store}`;
  const res = await postRequestApi(url, body);
  return res;
};

// 단일 매장의 선택한 게임 설정 변경
export const gameUpdate = async (body) => {
  const url = endpoints.tableGame.entertainment.games;
  const res = await putRequestApi(url, body);
  return res;
};

export default {
  gameProgressHistory,
  gameQuickMsgSave,
  gameQuickMsgLoad,
  gameStoreInfo,
  gameUpdateAtStore,
  gamesInfo,
  gameUpdate,
};
