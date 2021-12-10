import axios from 'axios';
import endpoints from './endpoints';

export const requestRobotStatus = async (storeCode) => {
  const url = `${endpoints.servingRobot.servingRobotStatus}?storeCode=${storeCode}`;
  const res = await axios.get(url);
  return res;
};

export default {
  requestRobotStatus
};