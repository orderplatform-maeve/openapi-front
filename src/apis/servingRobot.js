import { getRequestApi, postRequestApi } from '@utils/axiosUtils';
import endpoints from './endpoints';

export const requestRobotStatus = async (storeCode) => {
  const url = `${endpoints.servingRobot.servingRobotStatus}?storeCode=${storeCode}`;
  const res = await getRequestApi(url);
  return res;
};

export const requestRobotOrder = async (config) => {
  const url = `${endpoints.servingRobot.robotOrder}`;
  const fd = new FormData();
  fd.append('robotid', config.id);
  fd.append('tableName', config.tableName);
  fd.append('storeCode', config.storeCode);
  const res = await postRequestApi(url, fd);

  return res;
};

export const requestBackRobot = async (config) => {
  const headers = {
    "Content-Type": "application/json"
  };

  const param = {
    ssid: config.ssid,
    deviceid: config.deviceid,
  };

  const data = {
    headers,
    data: JSON.stringify(param),
  };

  const url = `${endpoints.servingRobot.backRobot}`;
  const res = await postRequestApi(url, data);

  return res;
};

export const requestRobotMoving = async (config) => {
  const url = `${endpoints.servingRobot.robotMoving}`;
  const fd = new FormData();
  fd.append('robotid', config.id);
  fd.append('tableName', config.tableName);
  fd.append('storeCode', config.storeCode);
  const res = await postRequestApi(url, fd);

  return res;
};

export default {
  requestRobotStatus,
  requestRobotOrder,
  requestBackRobot,
  requestRobotMoving
};
