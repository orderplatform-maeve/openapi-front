import store from "@store";
import endpoints from '@apis/endpoints';

export default {
  debug: false,
  connection: endpoints.socket,
  options: {
    transports: ["websocket"]
  },
  vuex: {
    store,
    actionPrefix: "SOCKET_",
    mutationPrefix: "SOCKET_"
  }
};
