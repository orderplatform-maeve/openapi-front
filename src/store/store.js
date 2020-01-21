import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

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
    MATCH_TABLES_POS: (state) => {
      let tables = state.tables;
      let pos = state.pos;
      if (Object.keys(tables).length && Object.keys(pos).length) {
        for (let key in tables) {
          let table = tables[key];
          let code_pos = table.code_pos;

          if (pos[code_pos]) {
            let item = pos[code_pos];
            let price_amt = 0;
            let qty_amt = 0;
            for (let order of item.orders) {
              price_amt += parseInt(order.good.price);
              qty_amt += order.qty;
            }
            table.qty_amt = qty_amt;
            table.price_amt = price_amt;
            table.orders = item.orders;
          }
        }
      }
      Vue.set(state, 'tables', tables);
    },
    syncCommitOrder(state, data) {
      console.log('syncCommitOrder', {data});
      let order = state.orders.find((i) => {
        return i.order_view_key == data.order_view_key;
      });
      order.commit = true;
      console.log('syncCommitOrder', {order});
    },
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

          // console.log('parseStore', parseStore[0]);

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
      context.commit('MATCH_TABLES_POS');
    },
    setPos: (context, data) => {
      context.commit('SET_POS', data);
      context.commit('MATCH_TABLES_POS');
    },
    setClient: (context, client) => {
      context.commit('SET_CLIENT', client);
    },
    setClients: (context, clients) => {
      context.commit('SET_CLIENTS', clients);
    },
    setCategorys: (context, categorys) => {
      context.commit('SET_CATEGORYS', categorys);
    },
    setProducts: (context, products) => {
      context.commit('SET_PRODUCTS', products);
    },
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
      return state.categorys;
    },
    products: (state) => {
      return state.products;
    },
    pos: (state) => {
      return state.pos;
    },
    stores: (state) => {
      return state.stores.sort((a, b) =>a.name - b.name);
    }
  },
});

export default store;
