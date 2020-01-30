import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

import { vaildShopCode } from './store.helper';

import {
  DEMO_URL,
  API_URL,
  ADMIN_URL,
} from './urls';

Vue.use(Vuex);

/**
* TODO:
* - 추후 소켓 부분 모듈화 예정
* - socket, rest, authentication 으웃 모듈 분류 예정
* - 의존성 없이 모듈 분리가 불가능.
* ISSUE:
* - vue-socket.io 내 emitter.js에서 분리된 vuex 모듈 config 코드가 없음 커스텀 작업 필요
*/
const socket = {
  mutations: {
    SOCKET_orderlog(state, order) {
      if (vaildShopCode(state, order)) {
        Vue.set(state, 'order', order);
      }
    },
  },
  actions: {
    SOCKET_orderlog({ commit, state }, order) {
      // console.log('SOCKET_orderlog', state.auth.store.code, order.shop_code);
      if (vaildShopCode(state, order)) {
        commit('PUSH_ORDER', order);
      }
    },
  },
};

const authentication = {
  mutations: {
    SET_AUTH: (state, payload) => {
      const {
        auth,
        data,
      } = payload;

      const orders = [];

      for (let item of data) {
        orders.push(JSON.parse(item.json_data));
      }

      Vue.set(state, 'auth', auth);
      Vue.set(state, 'orders', orders);
    },
    RESET_AUTH: (state) => {
      Vue.set(state, 'auth', authProto);
    },
  },
  actions: {
    async setAuth({commit}, auth) {
      const url = `${DEMO_URL}/logs/Today_redis_data`;
      const fd = new FormData();

      if (auth && auth.store && auth.store.code) {
        fd.append('shop_code', auth.store.code);
      }
      const response = await axios.post(url, fd);

      if (response.status === 200) {
        commit('SET_AUTH', {
          auth,
          data: response.data,
        });
        return true;
      }

      return false;
    },
    async login ({ dispatch }, payload) {
      try {
        const { id, pw } = payload;

        const url = `${DEMO_URL}/login/member_login`;

        const params = {
          member_id: id,
          member_pwd: pw,
        };

        const res = await axios.post(url, params);

        const data = res.data.data[0];

        if (res.data.data.length) {
          const member = {
            code: data['store_code'],
            name: data['store_name'],
          };

          console.log(data);

          const storeId = data['store_id'];

          const code = storeId || '';

          const store = {
            amt: null,
            cnt: 1,
            code,
            name: '',
          };

          const auth = {
            member,
            store,
          };

          console.log('auth', auth);

          await dispatch('setAuth', auth);

          const params = {
            member_code: code,
          };

          await dispatch('setStores', params);

          Vue.$cookies.set('auth',  auth, '1y', null, null);

          return true;
        } else {
          alert('아이디와 비밀번호를 입력해주세요');
          return false;
        }
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    logout({ commit }) {
      commit('RESET_AUTH');
    },
  },
};

const order = {
  mutations: {
    SET_ORDER: (state, order) => {
      Vue.set(state, 'order', order);
    },
    UNSET_ORDER: (state) => {
      Vue.set(state, 'order', undefined);
    },
    PUSH_ORDER: (state, order) => {
      state.orders.push(order);
    },
  },
  actions: {
    commitOrder: (context, payload) => {
      const url = `${DEMO_URL}/logs/commit_orderView_data`;
      const fd = new FormData();
      fd.append('shop_code', payload.auth.store.code);
      fd.append('key', payload.order.order_view_key);

      return axios
        .post(url, fd)
        .then(function(res) {
          if (res.data.result) {
            payload.order.commit = true;

            context.commit('UNSET_ORDER');
          }
        }.bind(this));
    },
    setOrder: (context, order) => {
      context.commit('SET_ORDER', order);
    },
    unsetOrder: (context) => {
      context.commit('UNSET_ORDER');
    },
    pushOrder: (context, order) => {
      context.commit('PUSH_ORDER', order);
    },
  },
};

const shop = {
  mutations: {
    SET_STORES: (state, stores) => {
      Vue.set(state, 'stores', stores);
    },
  },
  actions: {
    setStores: ({ commit }, params) => {
      return axios
        .get(`${API_URL}/stores`, {
          params,
        })
        .then(function(res) {
          if (res.data) {
            const stores = [];
            for (let item of res.data.store_data) {
              let store = {
                code: item.shop_code,
                name: item.shop_name,
              };
              if (item.current_order) {
                store.amt = item.current_order.amt;
                store.cnt = item.current_order.cnt;
              }
              stores.push(store);
            }
            commit('SET_STORES', stores);
          } else {
            // alert('매장이 없습니다.');
            console.log('store');
          }
        }.bind(this)).catch(function(err) {
          console.log({err: err});
        });
    },
  },
};

const device = {
  actions: {
    async setOpenTablet(context, params) {
      try {
        const url = `${ADMIN_URL}/store/shop_open`;
        const response = await axios(url, params);

        if (response) {
          return true;
        }

        return false;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    async setCloseTablet(context, params) {
      try {
        const url = `${ADMIN_URL}/store/shop_close`;
        const response = await axios(url, params);

        if (response) {
          return true;
        }

        return false;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    async setAgreeOrder(context, params) {
      try {
        const url = `${ADMIN_URL}/store/shop_open_order`;
        const response = await axios(url, params);

        if (response) {
          return true;
        }

        return false;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    async setRejectOrder(context, params) {
      try {
        const url = `${ADMIN_URL}/store/shop_close_order`;
        const response = await axios(url, params);

        if (response) {
          return true;
        }

        return false;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
};

const authProto = {
  member: {
    code: '',
    name: '',
  },
  store: {
    amt: null,
    cnt: 0,
    code: '',
    name: '',
  },
};

const state = {
  order: undefined,
  orders: [],
  auth: authProto,
  stores: [],
  store: {},
};

const mutations = {
  ...socket.mutations,
  ...authentication.mutations,
  ...order.mutations,
  ...shop.mutations,
};

const actions = {
  ...socket.actions,
  ...authentication.actions,
  ...order.actions,
  ...shop.actions,
  ...device.actions,
};

const getters = {
  order: (state) => {
    return state.order;
  },
  sortedOrders: (state) => {
    return state.orders.sort((a, b) =>  b.timestamp - a.timestamp);
  },
  lengthOrders: (state) => {
    return state.orders.length;
  },
  lengthCommitedOrders: (state) => {
    return state.orders.filter((order) => order.commit).length;
  },
  auth: (state) => {
    return state.auth;
  },
  store: (state) => state.store,
  stores: (state) => state.stores.sort((a, b) =>a.name - b.name),
};

const storeInit = {
  state,
  mutations,
  actions,
  getters,
};

const store = new Vuex.Store(storeInit);

export default store;
