import store from '@store';

export const SOCKET_URL = 'http://1.socketio.orderview.torder.co.kr';
// export const SOCKET_URL = 'localhost:3003';

export default {
  debug: false,
  connection: SOCKET_URL,
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_',
  },
};
