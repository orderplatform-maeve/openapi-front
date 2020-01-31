import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import axios from 'axios';

import { vaildShopCode } from './store.helper';
import { isEmpty } from '@utils/CheckedType';

import {
  DEMO_URL,
  ADMIN_URL,
} from './urls';
import endpoints from './endpoints';

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
        console.log('object');
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
    SET_AUTH: (state, auth) => Vue.set(state, 'auth', auth),
    RESET_AUTH: (state) => Vue.set(state, 'auth', authProto),
  },
  actions: {
    async login ({ commit }, params) {
      try {
        const url = endpoints.authentication.login;
        const res = await axios.post(url, params);

        if (!res) {
          throw 'response 값이 없습니다.';
        }

        if (!res.data) {
          throw 'response data 값이 없습니다.';
        }

        if (!res.data.result) {
          throw 'data result 값이 false 값입니다.';
        }

        if (!res.data.member_data || isEmpty(res.data.member_data)) {
          throw '멤버 정보 데이터가 없습니다.';
        }

        if (!res.data.shop_data) {
          throw '가게 정보 리스트 데이터가 없습니다.';
        }

        if (res.data.shop_data.length === 0) {
          throw '가게 정보 리스트가 빈 배열 입니다.';
        }

        console.log('member response', res);

        const member = {
          code: res.data.member_data.member_code,
          name: res.data.member_data.member_name,
        };

        const auth = {
          member,
          store: authProto.store,
        };

        commit('SET_STORES', res.data.shop_data);
        commit('SET_AUTH', auth);

        Vue.$cookies.set('auth', auth, '1y', null, null);

        return res.data.result;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    async setAuth({commit}, auth) {
      const url = `${DEMO_URL}/logs/Today_redis_data`;
      const fd = new FormData();

      if (auth && auth.store && auth.store.code) {
        fd.append('shop_code', auth.store.code);
      }
      const response = await axios.post(url, fd);

      console.log('response', response);

      if (response.status === 200) {
        commit('SET_AUTH', auth);
        return true;
      }

      return false;
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
    SET_ORDERS: (state, orders) => {
      console.log('orders!!!!!!!', orders);
      Vue.set(state, 'orders', orders);
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
    async setOrders({ commit }, auth) {
      const url = `${DEMO_URL}/logs/Today_redis_data`;
      const fd = new FormData();

      console.log('auth!@#!@#@!#!@#', auth, fd);

      if (auth && auth.store && auth.store.code) {
        fd.append('shop_code', auth.store.code);
      }
      const response = await axios.post(url, fd);

      if (response.status === 200) {
        const orders = response.data;
        commit('SET_ORDERS', orders);
      }
    },
  },
};

const shop = {
  mutations: {
    SET_STORES: (state, stores) => {
      console.log('stores', stores);
      Vue.set(state, 'stores', stores);
    },
  },
  actions: {
    setStores: ({ commit }, stores) => {
      commit('SET_STORES', stores);
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
  authentication: false,
  order: undefined,
  orders: [],
  auth: authProto,
  stores: [],
  device: {},
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
  order: (state) => state.order,
  sortedOrders: (state) => {
    const orders = [];

    for (let item of state.orders) {
      orders.push(JSON.parse(item.json_data));
    }

    // const filteredOrders = orders.filter((item) => item.shop_code === state.auth.store.store_code);

    return orders.sort((a, b) => b.timestamp - a.timestamp);
  },
  lengthOrders: (state) => state.orders.length,
  lengthCommitedOrders: (state) => state.orders.filter((order) => order.commit).length,
  auth: (state) => state.auth,
  device: (state) => state.device,
  stores: (state) => state.stores.sort((a, b) => a.name - b.name),
};

const plugins = [
  createPersistedState(),
];

const storeInit = {
  state,
  plugins,
  mutations,
  actions,
  getters,
};

const store = new Vuex.Store(storeInit);

export default store;
