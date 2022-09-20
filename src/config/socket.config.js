import store from '@store';
// import { isDemo } from '@utils/constants';
// import { STOP_REDIRECT } from '@utils/constants';

// const DEV_SOCKET_URL = 'localhost:3003';
// const DEV_SOCKET_URL = 'http://dev-socket-v2.torder.co.kr';
// const PROD_SOCKET_URL = 'http://master.socketio.torder.co.kr/';
const DEV_SOCKET_URL = 'http://development.socket.torder.co.kr:3003';

// const SOCKET_URL = 'http://1.socketio.orderview.torder.co.kr';

export default {
  debug: false,
  connection: DEV_SOCKET_URL,
  options: {
    transports: ['websocket'],
  },
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_',
  },
};
