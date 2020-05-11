import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import querystring from 'querystring';

import { vaildShopCode } from './store.helper';
import { isEmpty } from '@utils/CheckedType';
import { COOKIE_AUTH_NAME } from '@config';
import { COOKIE_DOMAIN } from '@config/auth.constant';

import endpoints from './endpoints';

Vue.use(Vuex);

function imagePreload(url) {
  const img = new Image();
  img.src = url;
}

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
      console.log('SOCKET_orderlog', order);
      if (vaildShopCode(state, order)) {
        commit('PUSH_ORDER', order);
      }
    },
    async SOCKET_orderview({ commit, state, dispatch }, payload) {
      console.log('out SOCKET_orderview', payload);

      if (payload?.type_msg === 'commit') {
        const targetOrder = {
          commit: payload.commit,
          order_view_key: payload.key,
        };

        console.log('targetOrder', targetOrder);
        console.log('SOCKET_orderview', payload);

        commit('UPDATE_ORDERS', targetOrder);
        return commit('UNSET_ORDER');
      }

      if (payload?.type === 'reload') {

        console.log('reload', payload);

        const validUCode = payload.uCode === localStorage?.uCode;
        const validMACAddr = payload.MACAddr === window.UUID?.getMacAddress();
        const isRedirection = validUCode || validMACAddr;
        console.log('reload SOCKET_orderview', payload, isRedirection);

        try {
          if (isRedirection) {
            const params = new FormData();
            params.append('store_code', state.auth.store.store_code);
            const res = await dispatch('setStoreInit', params);

            const nextUrl = res.data.data.T_order_store_orderView_version;
            if (nextUrl) {
              const {
                protocol,
                hostname,
                pathname,
              } = location;

              const nowPath = `${protocol}//${hostname}${pathname}#/`;
              console.log('location', nowPath);

              if (!process.env.STOP_REDIRECT) {
                // diff version
                if (nowPath !== nextUrl) {
                  return location.replace(nextUrl);
                }
                return location.replace('/');
              }
            }
          }
        } catch (error) {
          console.log(error);
        }
      }

      if (payload?.type === '@put/product/status') {
        if (payload?.good?.code) {
          // console.log('sync product data', payload.data);
          const arr = JSON.parse(JSON.stringify(state.goods));
          const findIdx = arr.findIndex((o) => o.T_order_store_good_code === payload.good.code);

          if (payload?.data) {
            arr[findIdx] = payload.data;
            commit('pushFlashMessage', `"${payload.good.displayName}" 정보가 수정되었습니다.`);
            commit('SET_GOODS', arr);
          }
        }
      }

      if (payload?.type === '@reset/orders') {
        commit('SET_TABLE_CART_LIST', []);
        commit('pushFlashMessage', '주문 삭제 되었습니다.');
      }

      if (payload?.type === '@create/orders') {
        if (payload?.order) {
          commit('SET_ORDER', payload.order);
        }

        if (payload?.orders) {
          commit('SET_TABLE_CART_LIST', payload?.orders);
        }

        if (payload.cartList?.length === 1) {
          commit('pushFlashMessage', `${payload.cartList[0].display_name}가 주문 되었습니다.`);
        }

        if (payload.cartList.length > 1) {
          const anotherCount = payload.cartList.length - 1;
          commit('pushFlashMessage', `${payload.cartList[0].display_name} 외 ${anotherCount}개 주문 되었습니다.`);
        }
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
        console.log('res', res);

        if (!res) {
          throw 'response 값이 없습니다.';
        }

        if (!res.data) {
          throw 'response data 값이 없습니다.';
        }

        if (!res.data.result) {
          throw '존재하지 않는 아이디 이거나 비밀번호가 잘못 되었습니다.';
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
          // member_code: res.data.member_data.member_code,
          code: res.data.member_data.member_id,
          name: res.data.member_data.member_name,
        };

        const auth = {
          member,
          store: authProto.store,
        };

        commit('SET_STORES', res.data.shop_data);
        commit('SET_AUTH', auth);

        Vue.$cookies.set(COOKIE_AUTH_NAME, auth, '1y', null, COOKIE_DOMAIN);
        localStorage.auth = JSON.stringify(auth);

        return res.data.result;
      } catch (error) {
        console.error(error);
        alert(error);
        return false;
      }
    },
    updateAuth({ commit }, auth) {
      commit('SET_AUTH', auth);
    },
    logout({ commit }) {
      commit('RESET_AUTH');
      commit('SET_STORES', []);
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
      // console.log('orders!!!!!!!', orders);
      Vue.set(state, 'orders', orders);
    },
    UPDATE_ORDERS: (state, order) => {
      const { orders } = state;
      const idx = orders.findIndex((item) => item.order_view_key === order.order_view_key);

      console.log('UPDATE_ORDERS', idx);

      if (idx > -1) {
        orders[idx].commit = order.commit;
        Vue.set(state, 'orders', orders);
      }
    },
  },
  actions: {
    async commitOrder(context, payload) {
      const url = endpoints.orders.commitOrderViewData;

      const fd = new FormData();
      fd.append('shop_code', payload.auth.store.store_code);
      fd.append('key', payload.order.order_view_key);
      fd.append('commit', !payload.order.commit ? 1 : 0);

      const res = await axios.post(url, fd, { timeout: 5000 });
      return res;
    },
    setOrder: (context, order) => {
      context.commit('SET_ORDER', order);
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

      return response;
    },
    async requestOrder(context, params) {
      const url = endpoints.orders.order;
      const response = await axios.post(url, params);

      if (response.data) {
        return response.data;
      }
      return false;
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
    async setStoreInit({ commit }, params) {
      try {
        const url = endpoints.shop.init;
        const response = await axios.post(url, params);
        // console.log(response);

        const target = response.data.data;

        const device = {
          serviceStatus: !!target.T_order_store_close,
          orderStatus: !!target.T_order_store_close_order,
        };

        commit('setDeviceStatus', device);

        return response;
      } catch (error) {
        // alert('서버 에러: 매장 정보를 가져올수 없습니다.');
        console.error(error);
        return false;
      }
    },
    async requestStoreList(context, params) {
      try {
        const fd = new FormData();
        fd.append('member_id', params.member.code);

        const url = endpoints.shop.getList;
        const res = await axios.post(url, fd);

        return res.data.shop_data;
      } catch (error) {
        return false;
      }
    },
  },
};

const device = {
  mutations: {
    setDeviceStatus(state, device) {
      // console.log('commit setDeviceStatus', device);
      Vue.set(state, 'device', device);
    }
  },
  actions: {
    async setOpenTablet(context, params) {
      try {
        const url = endpoints.device.shopOpen;
        const response = await axios.post(url, params);

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
        const url = endpoints.device.shopClose;
        const response = await axios.post(url, params);

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
        const url = endpoints.device.shopOpenOrder;
        const response = await axios.post(url, params);

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
        const url = endpoints.device.shopCloseOrder;
        const response = await axios.post(url, params);

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

const table = {
  mutations: {
    SET_TABLES: (state, tables) => Vue.set(state, 'tables', tables),
    SET_TABLE_CART_LIST: (state, cartList) => Vue.set(state, 'cartList', cartList),
    SHOW_ALL_REFRES_MODAL: (state) => Vue.set(state, 'visibleAllRefreshModal', true),
    CLOSE_ALL_REFRES_MODAL: (state) => Vue.set(state, 'visibleAllRefreshModal', false),
    SET_ALL_REFRESHLIST: (state, allRefreshList) => Vue.set(state, 'allRefreshList', allRefreshList),
  },
  actions: {
    async setTables({ commit }, payload) {
      const str = querystring.stringify(payload);
      const query = `?${str}`;
      const url = `${endpoints.table.getTableList}${query}`;

      const response = await axios.get(url);

      if (response.data && response.data.data) {
        commit('SET_TABLES', response.data.data);
      }
    },
    async setTableCartList({ commit }, params) {
      const url = endpoints.table.getCartList;
      const response = await axios.post(url, params);

      if (response.data && response.data.order_info) {
        commit('SET_TABLE_CART_LIST', response.data.order_info);
        return response.data;
      }
      return false;
    },
    async yesOrder(context, payload) {
      try {
        const res = await axios.post(endpoints.table.order, payload.params, payload.config);
        console.log(res);

        if (res.status === 200) {
          return res;
        }

        return false;
      } catch (error) {
        return false;
      }
    },
    async tabletReload(context, params) {
      try {
        const url = endpoints.tablet.refresh;

        const res = await axios.post(url, params);
        // console.log(res);
        return res;
      } catch (error) {
        return false;
      }
    },
    async allTaletReload(context, params) {
      try {
        const url = endpoints.tablet.allRefresh;

        const res = await axios.post(url, params);
        console.log(res);
      } catch (error) {
        return false;
      }
    }
  },
};

const menu = {
  mutations: {
    SET_CATEGORIES: (state, categories) => Vue.set(state, 'categories', categories),
    SET_GOODS: (state, goods) => Vue.set(state, 'goods', goods),
  },
  actions: {
    async setCategories({ commit }, params) {
      const url = endpoints.menu.categories;
      const response = await axios.post(url, params);

      if (response.data && response.data.data) {
        commit('SET_CATEGORIES', response.data.data);
        return response.data.data;
      }
      return false;
    },
    async setGooods({ commit }, params) {
      const url = endpoints.menu.getGoodsList;
      const response = await axios.post(url, params);

      if (response.data && response.data.data) {
        // const array = JSON.parse(JSON.stringify(response.data.data));

        // for (let index = 0; index < array.length; index++) {
        //   const element = array[index];
        //   if (element.T_order_store_good_image) {
        //     imagePreload(element.T_order_store_good_image);
        //   }
        // }

        commit('SET_GOODS', response.data.data);
        return response.data.data;
      }
      return false;
    },
  },
  getters: {
    getCategories(state) {
      const processCategories = state.categories.map((item) => ({
        code: item.T_order_store_menu_code,
        parentCodes: JSON.parse(item.T_order_store_menu_depth),
        name: item.T_order_store_menu_name,
        names: item.T_order_store_menu_name_array,
        sortNo: Number(item.T_order_store_menu_sort_number),
        serviceFlag: item.T_order_store_menu_serviceUse,
        startTime: item.T_order_store_menu_starttime,
        endTime: item.T_order_store_menu_endtime,
      }));

      const firstCategories = processCategories.filter((category) => {
        return category.parentCodes.includes('1');
      }).sort((a, b) => a.sortNo - b.sortNo);

      const secondCategories = firstCategories.map((fCtg) => {
        return processCategories.filter((ctg) => {
          return ctg.parentCodes.includes(fCtg.code);
        }).sort((a, b) => a.sortNo - b.sortNo);
      });

      const results = firstCategories.map((item, idx) => ({
        ...item,
        subCategories: secondCategories[idx],
      }));

      return results;
    },
    processGoods(state) {
      return state.goods.map( p => {
        let categories = p.T_order_store_good_category;

        try {
          if (typeof categories === "string") {
            categories = JSON.parse(categories);
          }
        } catch(e) {
          console.log(e);
        }

        if (p.T_order_store_good_image) {
          imagePreload(p.T_order_store_good_image);
        }

        return {
          categories,
          code: p.T_order_store_good_code,
          price: p.T_order_store_good_defualt_price,
          displayName: p.T_order_store_good_display_name,
          displayNameOneLine: p.T_order_store_good_display_name.replace(/\/\//gi, " "),
          displayNameNewLine: p.T_order_store_good_display_name.replace(/\/\//gi, "<br/>"),
          image: p.T_order_store_good_image,
          name: p.T_order_store_good_name,
          names: p.T_order_store_good_name_array,
          sortNo: p.T_order_store_good_sort_number,
          updated_dt: p.T_order_store_good_update_date,
          noUse: p.T_order_store_good_use,
          keyword: p.T_order_store_keyword,
          hideInCart: p.T_order_store_non_show_cart,
          posCode: p.T_order_store_pos_code,
          options: p.option_group,
          description: p.T_order_store_good_html,
          descriptionFlag: p.T_order_store_good_html_flag.toLowerCase(),
          openDetail: p.T_order_store_good_detail_open,
          reviews: p.menuRatingList,
          soldout: p.T_order_store_good_soldout,
          best: p.type_best,
          hit: p.type_hit,
          md: p.type_md,
          sale: p.type_sale,
        };
      }).sort((a, b) => a.sortNo - b.sortNo);
    },
    getCategoriesGoods(state, getters) {
      const { processGoods, getCategories } = getters;

      const findGoods = (good, subCategory) => {
        const { categories } = good;

        if (categories) {
          return categories.includes(subCategory);
        }
      };

      const getFilteredGoods = (products, subCategory) => {
        return products.filter((good) => findGoods(good, subCategory));
      };

      const getSubCategoryItem = (subCategoryItem, products) => {
        const goods = getFilteredGoods(products, subCategoryItem.code);
        return {
          ...subCategoryItem,
          goods,
        };
      };

      const getCategoryItem = (categoryItem) => {
        const getSubCategoryObj = (subCategoryItem) => getSubCategoryItem(subCategoryItem, processGoods);
        const subCategories = categoryItem.subCategories.map(getSubCategoryObj);
        return {
          ...categoryItem,
          subCategories,
        };
      };

      const results = getCategories.map(getCategoryItem);
      // console.log(results);
      return results;
    },
  },
};

const monitoring = {
  mutations: {
    updateMACAddr(state, payload) {
      state.MACAddr = payload;
    },
    updateUCode(state, payload) {
      state.uCode = payload;
    },

  },
};

const goods = {
  actions: {
    async updateGoodStatusType(context, payload) {

      const url = endpoints.goods.updateGoodStatus;

      const res = await axios.get(url, payload);

      console.log('update goods type response', res);

      return res;
    },
  },
};

const popup = {
  mutations: {
    pushFlashMessage(state, message) {
      let time = new Date().getTime();
      let indexLast = 0;

      for (let index in state.flashMessages) {
        index = parseInt(index);
        const message = state.flashMessages[index];

        if (message.time + 3000 < time && indexLast < index ) {
          indexLast = index;
        }
      }

      if (indexLast > 0) {
        state.flashMessages = state.flashMessages.slice(0, indexLast);
      }

      let item = {
        key: this.state.flashMessageCount,
        message: message,
        time: new Date().getTime(),
      };

      this.state.flashMessageCount += 1;

      state.flashMessages.push(item);
    },
  },
};

const tablet = {
  actions: {
    async resetOrder(context, params) {
      const url = endpoints.tablet.resetOrder;

      const res = await axios.post(url, params);

      return res;
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
    code: '',
    name: '',
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
  tables: [],
  cartList: [],
  categories: [],
  goods: [],
  MACAddr: '00:00:00:00:00:00',
  uCode: '',
  flashMessages: [],
  flashMessageCount: 0,
  visibleAllRefreshModal: false,
  allRefreshList: [],
};

const mutations = {
  ...socket.mutations,
  ...authentication.mutations,
  ...order.mutations,
  ...shop.mutations,
  ...table.mutations,
  ...menu.mutations,
  ...monitoring.mutations,
  ...device.mutations,
  ...popup.mutations,
};

const actions = {
  ...socket.actions,
  ...authentication.actions,
  ...order.actions,
  ...shop.actions,
  ...device.actions,
  ...table.actions,
  ...menu.actions,
  ...goods.actions,
  ...tablet.actions,
};

const getters = {
  ...menu.getters,
};

const plugins = [];

const storeInit = {
  state,
  plugins,
  mutations,
  actions,
  getters,
};

const store = new Vuex.Store(storeInit);

export default store;
