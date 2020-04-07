import store from '@store';
import { isDev } from '@utils/constants';

const DEV_SOCKET_URL = 'localhost:3003';
const PROD_SOCKET_URL = 'http://1.socketio.orderview.torder.co.kr';

// export const SOCKET_URL = 'http://1.socketio.orderview.torder.co.kr';
export const SOCKET_URL = isDev ? DEV_SOCKET_URL : PROD_SOCKET_URL;

export default {
  debug: false,
  connection: SOCKET_URL,
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_',
  },
};
