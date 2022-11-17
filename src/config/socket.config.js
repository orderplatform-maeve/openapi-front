import store from '@store';
import { IS_DEV_TEAM } from '@utils/constants';

// const DEV_SOCKET_URL = 'localhost:3003';
// const DEV_SOCKET_URL = 'http://dev-socket-v2.torder.co.kr';
const DEV_SOCKET_URL = 'http://development.socket.torder.co.kr:3003';
const PROD_SOCKET_URL = 'http://master.socketio.torder.co.kr';

const SOCKET_URL = IS_DEV_TEAM ? DEV_SOCKET_URL : PROD_SOCKET_URL;

export default {
  debug: false,
  connection: SOCKET_URL,
  options: {
    transports: ['websocket'],
  },
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_',
  },
};
