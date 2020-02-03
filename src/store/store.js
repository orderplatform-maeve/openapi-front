import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import axios from 'axios';

import { vaildShopCode } from './store.helper';
import { isEmpty } from '@utils/CheckedType';
import { COOKIE_AUTH_NAME } from '@config';

import {
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
        Vue.set(state, 'order', order);
      }
    },
    SOCKET_resStoreInfo(state, storeDeviceInfo) {
      Vue.set(state, 'device', storeDeviceInfo);
    },
  },
  actions: {
    SOCKET_orderlog({ commit, state }, order) {
      // console.log('SOCKET_orderlog', state.auth.store.store_code, order.shop_code);
      if (vaildShopCode(state, order)) {
        // order 데이터더가 orders의 아이템 형태와 다름
        commit('PUSH_ORDER', order);
      }
    },
    SOCKET_resStoreInfo(context, storeDeviceInfo) {
      // console.log('data!!!!!!!!!!', storeDeviceInfo);
    }
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

        Vue.$cookies.set(COOKIE_AUTH_NAME, auth, '1y', null, null);

        return res.data.result;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    updateAuth({ commit }, auth) {
      commit('SET_AUTH', auth);
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
    UPDATE_ORDERS: (state, order) => {
      const { orders } = state;
      const idx = orders.findIndex((item) => item.order_view_key === order.order_view_key);

      console.log('idx!~@~!~@', idx);

      if (idx > -1) {
        orders[idx].commit = true;
        Vue.set(state, 'orders', orders);
      }
    },
  },
  actions: {
    async commitOrder({ commit }, payload) {
      const url = endpoints.orders.commitOrderViewData;
      const fd = new FormData();
      fd.append('shop_code', payload.auth.store.store_code);
      fd.append('key', payload.order.order_view_key);

      const res = await axios.post(url, fd);

      if (res && res.data && res.data.result) {

        const order = {
          ...payload.order,
          commit: true,
        };

        // console.log(order_id)

        commit('UPDATE_ORDERS', order);
        // payload.order.commit = true;
        commit('UNSET_ORDER');
      }
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
    async setOrders({ commit }, params) {
      const url = endpoints.orders.todayRedisData;
      const response = await axios.post(url, params);

      if (response.status === 200) {
        const orders = [];

        for (let item of response.data) {
          // api 서버에서 가공해서 주는 요청으로 변경 할 필요 있음
          orders.push(JSON.parse(item.json_data));
        }

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
    store_code: '',
    store_id: '',
    store_name: '',
  },
};

const state = {
  order: undefined,
  orders: [],
  device: {
    serviceStatus: false,
    orderStatus: false,
  },
  auth: authProto,
  stores: [],
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

const getters = {};

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
