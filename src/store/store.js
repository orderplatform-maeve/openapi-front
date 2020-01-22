import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

/**
* TODO:
* - 추후 소켓 부분 모듈화 예정
* ISSUE:
* - vue-socket.io 내 emitter.js에서 분리된 vuex 모듈 config 코드가 없음 커스텀 작업 필요
*/
const socket = {
  mutations: {
    SOCKET_resStoreInfo(state, data) {
      Vue.set(state, 'store', data);
    },
    SOCKET_resTablesInfo(state, data) {
      Vue.set(state, 'tables', data);
    },
    SOCKET_resPos(state, data) {
      Vue.set(state, 'pos', data);
    },
    SOCKET_resCategorys(state, data) {
      Vue.set(state, 'categorys', data);
    },
    SOCKET_resProducts(state, data) {
      Vue.set(state, 'products', data);
    },
    SOCKET_resClients(state, data) {
      Vue.set(state, 'clients', data);
    },
  },
  actions: {
    SOCKET_resStoreInfo(context, message) {
      console.log('SOCKET_resStoreInfo', context, message);
    },
    SOCKET_resTablesInfo(context, message) {
      console.log('SOCKET_resTablesInfo', context, message);
    },
    SOCKET_resPos(context, message) {
      console.log('SOCKET_resPos', context, message);
    },
    SOCKET_resCategorys(context, message) {
      console.log('SOCKET_resCategorys', context, message);
    },
    SOCKET_resProducts(context, message) {
      console.log('SOCKET_resProducts', context, message);
    },
    SOCKET_resClients(context, message) {
      console.log('SOCKET_resClients', context, message);
    },
  },
};

const store = new Vuex.Store({
  state: {
    order: undefined,
    orders: [],
    tables: {},
    clients: {},
    categorys: {},
    products: {},
    pos: {},
    auth: {
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
    },
    stores: [],
    store: {},
  },
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
    SET_STORES: (state, stores) => {
      Vue.set(state, 'stores', stores);
    },
    SET_TABLES: (state, tables) => {
      for (let key in tables) {
        tables[key].client_count = 0;
        tables[key].price_amt = 0;
      }
      Vue.set(state, 'tables', tables);
    },
    SET_CLIENT: (state, client) => {
      let items = state.tables;
      if (items[client.tablet_number]) {
        if (client.action == 'inc') {
          items[client.tablet_number].client_count += 1;
        } else if (client.action == 'dec') {
          items[client.tablet_number].client_count -= 1;
        }
      }
      Vue.set(state, 'tables', items);
    },
    SET_CLIENTS: (state, clients) => {
      let tables = state.tables;
      for (let key in tables) {
        let table = tables[key];
        table.client_count = 0;
        table.clients = [];
      }
      for (let myid in clients) {
        let client = clients[myid];
        if (tables[client.tablet_number]) {
          let table = tables[client.tablet_number];
          table.client_count += 1;
          table.clients.push(client);
        }
      }
      Vue.set(state, 'clients', clients);
      Vue.set(state, 'tables', tables);
    },
    SET_CATEGORYS: (state, categorys) => {
      Vue.set(state, 'categorys', categorys);
    },
    SET_PRODUCTS: (state, products) => {
      Vue.set(state, 'products', products);
    },
    SET_POS: (state, data) => {
      Vue.set(state, 'pos', data);
    },
    syncCommitOrder(state, data) {
      console.log('syncCommitOrder', {data});
      let order = state.orders.find((i) => {
        return i.order_view_key == data.order_view_key;
      });
      order.commit = true;
      console.log('syncCommitOrder', {order});
    },
    ...socket.mutations,
  },
  actions: {
    commitOrder: (context, payload) => {
      let url = 'http://demo.torder.co.kr/logs/commit_orderView_data';
      let fd = new FormData();
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
    setAuth: ({commit}, auth) => {
      let url = 'http://demo.torder.co.kr/logs/Today_redis_data';
      let fd = new FormData();
      if (auth && auth.store && auth.store.code) {
        fd.append('shop_code', auth.store.code);
      }

      return axios
        .post(url, fd)
        .then(function(res) {
          commit('SET_AUTH', {
            auth,
            data: res.data,
          });
        }.bind(this));
    },
    async login ({ dispatch }, payload) {
      try {
        const { id, pw } = payload;

        const url = 'http://api.auth.order.orderhae.com/login';

        const params = {
          id,
          pw,
        };

        const res = await axios.post(url, params);

        const data = res.data[0];

        if (res.data.length) {
          const member = {
            code: data['T_order_id'],
            name: data['T_order_member_name'],
          };

          const parseStore = JSON.parse(data['T_order_member_store_data']);

          const store = {
            amt: null,
            cnt: 1,
            code: parseStore[0].store_info[0].store_id,
            name: '',
          };

          const auth = {
            member,
            store,
          };

          console.log('auth', auth);

          Vue.$cookies.set('auth',  auth, '1y', null, null);

          await dispatch('setAuth', auth);

          let params = {
            member_code: auth.member.code,
          };

          await dispatch('setStores', params);

          return true;
        } else {
          alert('아이디와 비밀번호를 입력해주세요');
          return false;
        }
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    setStores: ({ commit }, params) => {
      return axios
        .get('http://api.auth.order.orderhae.com/stores', {
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
            alert('매장이 없습니다.');
          }
        }.bind(this)).catch(function(err) {
          console.log({err: err});
        });
    },
    setTables: (context, tables) => {
      context.commit('SET_TABLES', tables);
    },
    setPos: (context, data) => {
      context.commit('SET_POS', data);
    },
    setClient: (context, client) => {
      context.commit('SET_CLIENT', client);
    },
    setCategorys: (context, categorys) => {
      context.commit('SET_CATEGORYS', categorys);
    },
    setProducts: (context, products) => {
      context.commit('SET_PRODUCTS', products);
    },
    ...socket.actions,
  },
  getters: {
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
    tables: (state) => {
      return state.tables;
    },
    table: (state, tablet_number) => {
      return state.tables[tablet_number];
    },
    clients: (state) => {
      return state.clients;
    },
    client: (state, myid) => {
      return state.clients[myid];
    },
    categorys: (state) => {
      const { categorys } = state;

      let result = {};
      for (let category of categorys) {
        const code = category['T_order_store_menu_code'];
        category.T_order_store_menu_depth = JSON.parse(category.T_order_store_menu_depth);
        result[code] = category;
      }

      return result;
    },
    products: (state) => {
      const { products } = state;

      let result = {};
      for (let product of products) {
        let code = product['T_order_store_good_code'];
        product.T_order_store_good_category = JSON.parse(product.T_order_store_good_category);
        if (!product.T_order_store_good_category) {
          product.T_order_store_good_category = [];
        }
        result[code] = product;
      }

      return result;
    },
    pos: (state) => {
      const { pos, auth } = state;

      if (pos && pos.storeCode && pos.storeCode === auth.store.code) {
        let pos_tables = {};
        for (let item of pos.data) {
          pos_tables[item.id] = item;
        }
        return pos_tables;
      }

      return state.pos;
    },
    store: (state) => state.store,
    stores: (state) => {
      return state.stores.sort((a, b) =>a.name - b.name);
    }
  },
});

export default store;
