import store from '@store';
// import { isDemo } from '@utils/constants';
// import { STOP_REDIRECT } from '@utils/constants';

// const DEV_SOCKET_URL = 'localhost:3003';
// const DEV_SOCKET_URL = 'http://dev-socket-v2.torder.co.kr';
const PROD_SOCKET_URL = 'http://1.socketio.torder.co.kr';

// const SOCKET_URL = 'http://1.socketio.orderview.torder.co.kr';
// export const SOCKET_URL = isDemo ? DEV_SOCKET_URL : PROD_SOCKET_URL;
// export const SOCKET_URL = STOP_REDIRECT ? DEV_SOCKET_URL : PROD_SOCKET_URL;
export const SOCKET_URL = PROD_SOCKET_URL;

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
