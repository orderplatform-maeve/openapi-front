import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import querystring from 'querystring';
import router from '@router';

import {
  validShopCode,
  getCategories,
  getNewCategories,
} from './store.helper';
import { isEmpty } from '@utils/CheckedType';
import endpoints from '@apis/endpoints';
import {
  postOrderConfirm
} from '@apis/orders';

import {
  robot,
  noticePopup,
  valet,
} from './modules';

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
  // mutations: {
  //   SOCKET_orderlog(state, order) {
  //     if (validShopCode(state, order)) {
  //       if (router.currentRoute.name !== 'paymentManagement') {

  //         if (!state.orderKeys.has(order.order_view_key)) {

  //           if (order.type === 'posResponseMessage') {
  //             if (order.errorMsg?.length > 0) {
  //               state.posResponseMessage = true;
  //               state.orderModal = false;
  //             }
  //           } else {
  //             state.posResponseMessage = false;
  //             state.orderModal = true;
  //           }

  //           if (window?.UUID?.playOrderBell) {
  //             if (order.creditType !== "cash") {
  //               window.UUID.playOrderBell();
  //             }
  //           }

  //           state.orderKeys.set(order.order_view_key, true);
  //           Vue.set(state, 'order', order);
  //         }
  //       }
  //     }
  //   },
  // },
  actions: {
    SOCKET_orderlog({ commit , state }, order) {
      // console.log('SOCKET_orderlog', order);
      if (validShopCode(state, order)) {
        // console.log('주문 커먼-order', order);
        // console.log('주문 커먼-state', state);
        // console.log('주문커먼-commit', commit);
        const receiptHandle = order?.receipt_handle;

        if (receiptHandle) {
          const config = {
            'storeCode': order?.shop_code,
            'tabletId': order?.T_order_order_tablet_number,
            'orderKey': order?.order_view_key,
            receiptHandle,
          };
          postOrderConfirm(config);
        }

        // pos error 메세지는 orders list에 추가되면 안되므로 주문키 if문 외부에 작성
        // if (order.type === 'posResponseMessage') {
        //   if (order.tableNumber && order.errorMsg?.length > 0) {
        //     // mutations에서 pos message에 대한 order가 set 되지 않을 경우 방지
        //     commit('SET_ORDER', order);
        //     state.posResponseMessage = true;
        //     state.orderModal = false;
        //   }
        // }

        if (order.type !== 'posResponseMessage' && !state.orderKeys.has(order.order_view_key)) {
          state.orderKeys.set(order.order_view_key, true);
          if (state.posResponseModal.isOn) {
            state.posResponseModal.isOn = false;
            state.posResponseModal.tableNumber = '';
          }
          commit('SET_ORDER', order);
          state.orderModal = true;

          const businessType = state.menuConfig?.init?.business_type;

          if (window?.UUID?.playOrderBell && businessType === 'torder') {
            window.UUID.playOrderBell();
          }
          commit('PUSH_ORDER', order);
          state.orderKeys.set(order.order_view_key, true);
        }

        if (!state.orderKeys.has(order.order_view_key)) {
          // if (window?.UUID?.playOrderBell) {
          //   window.UUID.playOrderBell();
          // }
          if (order.viewType === 5) {
            state.auction = true;
          } else {
            state.auction = false;
          }
          // commit('PUSH_ORDER', order);
        }
      }
    },
    async SOCKET_orderview({ commit, state, dispatch }, payload) {
      //console.log('out SOCKET_orderview', payload);

      // pos error 메세지는 orders list에 추가되면 안되므로 주문키 if문 외부에 작성
      if (payload?.type === 'posResponseMessage') {
        if (payload.tableNumber && payload.errorMsg?.length > 0) {
          // mutations에서 pos message에 대한 order가 set 되지 않을 경우 방지
          state.orderKeys.set(payload.order_view_key, true);
          state.posResponseModal.isOn = true;
          state.posResponseModal.tableNumber = payload.tableNumber;
          state.orderModal = false;
          // commit('PUSH_ORDER', order);
        }
      }

      if (payload?.type_msg === 'commit') {
        const targetOrder = {
          commit: payload.commit,
          order_view_key: payload.key,
        };

        // const target = state.orders.find((o) => o.order_view_key === payload.key);
        // console.log('targetOrder', targetOrder);
        // console.log('SOCKET_orderview', payload, target);

        commit('UPDATE_ORDERS', targetOrder);
        // commit('pushFlashMessage', `${target.T_order_order_tablet_number} 테이블 주문이(${target.order_time}) ${targetOrder.commit ? '확인' : '미확인'} 상태로 변경 되었습니다.`);
        return commit('UNSET_ORDER');
      }

      // 주문 강제취소에 대한 소켓메세지 & 보류 처리건에 대한 소켓메세지 - 서버측 추후 하나로 통합 예정
      if (payload?.type === 'cancelOrder' || payload?.type === 'pendOrder') {
        const fd = new FormData();
        fd.append('shop_code', state.auth.store.store_code);
        dispatch('setOrders', fd);
      }

      if (payload?.type === 'reload') {
        // // console.log('reload', payload);

        const validUCode = payload.uCode === localStorage?.uCode;
        const validMACAddr = payload.MACAddr === window.UUID?.getMacAddress();
        const isRedirection = validUCode || validMACAddr;
        // console.log('reload SOCKET_orderview', payload, isRedirection);

        try {
          if (isRedirection) {
            const params = new FormData();
            params.append('store_code', state.auth.store.store_code);
            const res = await dispatch('setStoreInit', params);

            let nextUrl = res.data.data.T_order_store_orderView_version;
            if (nextUrl) {
              const {
                protocol,
                hostname,
                pathname,
              } = location;

              const nowPath = `${protocol}//${hostname}${pathname}#/`;
              // console.log('location', nowPath);

              if (!process.env.STOP_REDIRECT) {
                const { store_code } = state.auth.store;

                if (state.visibleAllRefreshModal) {
                  // commit('CLOSE_ALL_REFRESH_MODAL');
                  Vue.$socket.emit('orderview', {
                    store: {
                      code: store_code,
                    },
                    type: '@close/allRefreshModal',
                  });
                }

                if (nextUrl.includes('torder.io')) {
                  nextUrl = `${nextUrl}#/login?store_code=${store_code}`;
                }

                // diff version
                if (nowPath !== nextUrl) {
                  return location.replace(nextUrl);
                }
                return location.replace('/');
              }
            }
          }
        } catch (error) {
          // console.log(error);
        }
      }

      if (payload?.type === '@put/product/status') {
        if (payload?.good?.code) {
          // // console.log('sync product data', payload.data);
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

      if (payload?.type === '@show/allRefreshModal') {
        // // console.log('@show/allRefreshModal', payload.allRefreshList);
        commit('SHOW_ALL_REFRESH_MODAL');
        commit('SET_ALL_REFRESH_LIST', payload.allRefreshList);
      }

      if (payload?.type === '@close/allRefreshModal') {
        commit('CLOSE_ALL_REFRESH_MODAL');
      }

      if (payload?.type === '@request/ordering/location/table') {
        // // console.log('object', state.tables);
        const findTargetIdx = state.tables.findIndex((o) => o.Ta_id === payload.tableId);

        // console.log('findTargetIdx', payload.tableId, findTargetIdx, state.tables);

        if (findTargetIdx === -1) {
          // 주석 해제 필수
          // return commit('pushFlashMessage', '일치하는 테이블 아이디를 찾지 못했습니다.');
        }
        // if (findTargetIdx === -1) return false;

        const deepCopyArr = JSON.parse(JSON.stringify(state.tables));

        deepCopyArr[findTargetIdx] = {
          ...deepCopyArr[findTargetIdx],
          ordering: payload.ordering,
        };

        // commit('SET_TABLES', deepCopyArr);
      }

      if (payload?.type === '@update/categories/useStatus') {
        commit('SET_MENU_USE', payload.target);
        commit('pushFlashMessage', `${payload.target.name} ${payload.target.depthStr} 카테고리 상태가 ${payload.target?.T_order_store_menu_use === 'Y' ? '개방' : '닫힘'}으로 변경이 되었습니다.`);
      }

      if (payload?.type === '@update/device/serviceStatus') {
        commit('setDeviceServiceStatus', payload.value);
        if (payload.value) {
          commit('pushFlashMessage', '태블릿 화면 닫기 상태로 변경 되었습니다.');
        } else {
          commit('pushFlashMessage', '태블릿 화면 열기 상태로 변경 되었습니다.');
        }
      }

      if (payload?.type === '@update/device/agreeOrder') {
        commit('setDeviceOrderStatus', payload.value);
        if (payload.value) {
          commit('pushFlashMessage', '태블릿 주문 중단 상태로 변경 되었습니다.');
        } else {
          commit('pushFlashMessage', '태블릿 주문 받기 상태로 변경 되었습니다.');
        }
      }

      if (payload?.type === '@update/device/recentOrder') {
        commit('setDeviceRecentOrderStatus', payload.value);
        if (payload.value) {
          commit('pushFlashMessage', '태블릿 주문 내역 숨김 상태로 변경 되었습니다.');
        } else {
          commit('pushFlashMessage', '태블릿 주문 내역 표시 상태로 변경 되었습니다.');
        }
      }

      if (payload?.type === '@update/device/kitchenOrder') {
        commit('setDeviceKitchenOrderStatus', payload.value);
        if (payload.value) {
          commit('pushFlashMessage', '태블릿 주문 내역 숨김 상태로 변경 되었습니다.');
        } else {
          commit('pushFlashMessage', '태블릿 주문 내역 표시 상태로 변경 되었습니다.');
        }
      }

      if (payload?.type === 'suspendSale') {
        // console.log('suspendSale', payload);
        const findTargetIdx = state.tables.findIndex((o) => o.Ta_id === payload.table.code);
        const { suspendSale } = payload;
        const orderStatus = !suspendSale;

        const deepCopyArr = JSON.parse(JSON.stringify(state.tables));

        const beforeOrderStatus = deepCopyArr[findTargetIdx].orderStatus;

        if (orderStatus !== beforeOrderStatus) {
          deepCopyArr[findTargetIdx] = {
            ...deepCopyArr[findTargetIdx],
            orderStatus,
          };

          commit('SET_TABLES', deepCopyArr);
        }
      }

      // 공지사항 팝업 관련
      if (payload?.type === 'notice') {
        const data = [payload.data];
        this.commit('noticePopup/updateNoticeEmergency', true);
        this.commit('noticePopup/updateNoticePopupData', data);
        this.commit('noticePopup/updatePopupVisible', true);
      }

      const isRobot = payload.type === 'Ready' || payload.type === 'OnTheWay' || payload.type === 'Arrived' || payload.type === 'Unknown' || payload.type === 'Returning' || payload.type === 'Charge';

      if (payload?.type === 'Error') {
        this.commit('robot/updateErrorModalStatus', true);
        this.commit('robot/updateErrorRobotStatus', {
          name: payload.robotInfo.name,
          message: payload.robotInfo.message,
        });
      }

      // 새로운 공지사항 유입시 갯수 갱신
      if (payload?.type === 'countUpdate') {
        const newNoticeCount = payload?.count;
        console.log('newNoticeCount', newNoticeCount);
        this.commit('noticePopup/updateNoticeQuantity', newNoticeCount);
      }

      if (isRobot) {
        try {
          const config = {
            robotId: payload.robotInfo.robot_id,
            robotInfo: payload.robotInfo,
            status: payload.ment,
            ReverseDestination: payload.table.name,
          };

          config.robotInfo.reveseStatus = payload.ment;
          this.commit('robot/updateRobotStatus', config);
        } catch(error) {
          console.log(error);
        }
      }

      const businessType = state.menuConfig?.init?.business_type;

      if (
        state.auth.store.store_code === payload?.store?.code &&
        payload?.type === "valetParking"
      ) {

        if (window?.UUID?.playOrderBell && businessType === 'torder') {
          window.UUID.playOrderBell();
        }

        commit('valet/updateCarNumber', payload?.info?.carNumber);

        if (router?.history?.current?.path !== "/valetParkingConfirm") {
          router.push({
            name: 'valetParkingConfirm',
          });
        }
      }

      // 선결제 - 현금 취소 요청 알림
      if (payload?.type === 'requestCancelCash') {
        commit('updateCashPaymentCancelModal', true);
        commit('updateCashPaymentCancelInfo', payload);
      }

      // 선결제 - 현금 결제 요청 알림
      if (payload?.type === 'requestReceiptCash') {
        if (window?.UUID?.playOrderBell && businessType === 'torder') {
          window.UUID.playOrderBell();
        }

        commit('setRequestCashItem', payload.data);

        const cashPaymentInfo = {
          tableName: payload.table.name,
          amount: payload.amount,
        };
        commit('updateCashPaymentRequestInfo', cashPaymentInfo);
        commit('updateCashPaymentRequestModal', true);
      }
    },
    SOCKET_disconnect({ commit }) {
      const now = new Date(Date.now());
      const log = `disconnected socket ${now}`;

      if (process.env.NODE_ENV === 'development') {
        if (!localStorage.networkLog) {
          localStorage.networkLog = JSON.stringify([log]);
        } else {
          const parse = JSON.parse(localStorage.networkLog);
          localStorage.networkLog = JSON.stringify([...parse, log]);
        }
      }

      const payload = {
        visible: true,
        message: '소켓 서버 연결 요청 중 입니다. 잠시만 대기 해주십시요.',
      };

      commit('setSignBoardStatus', payload);
    },
    SOCKET_connect({ commit }) {
      const now = new Date(Date.now());
      const log = `connected socket ${now}`;

      if (process.env.NODE_ENV === 'development') {
        if (!localStorage.networkLog) {
          localStorage.networkLog = JSON.stringify([log]);
        } else {
          const parse = JSON.parse(localStorage.networkLog);
          localStorage.networkLog = JSON.stringify([...parse, log]);
        }
      }
      console.log(log);

      const payload = {
        visible: false,
        message: '',
      };

      commit('setSignBoardStatus', payload);
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
        // console.log('res', res);

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
          throw '로그인 정보가 없습니다.';
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

        localStorage.auth = JSON.stringify(auth);

        return res.data.result;
      } catch (error) {
        commit('pushFlashMessage', error);
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
    UPDATE_ORDER_CREDIT: (state, order, value) => {
      const { orders } = state;
      const idx = orders.findIndex((item) => item.order_id === order.order_id);

      console.log(idx);
      if (idx > -1) {
        orders[idx].creditStat = value;
      }

    },
    UPDATE_ORDERS: (state, order) => {
      const { orders } = state;
      const idx = orders.findIndex((item) => item.order_view_key === order.order_view_key);

      // console.log('UPDATE_ORDERS', idx);

      if (idx > -1) {
        orders[idx].commit = order.commit;
        Vue.set(state, 'orders', orders);
      }
    },
    UPDATE_DONE_MISU_ORDERS: (state, order) => {
      const { orders } = state;
      const idx = orders.findIndex((item) => item.order_view_key === order.order_view_key);

      // console.log('UPDATE_ORDERS', idx);

      if (idx > -1) {
        orders[idx].totalAmount = order.totalMisu;
        orders[idx].totalMisu = 0;
        Vue.set(state, 'orders', orders);
      }
    },
    setPayloadStatus(state, payload) {
      state.payloadStatus = payload;
    },
    filterEvent(state, payload) {
      state.orders = payload;
    },
    auctionFlag(state, payload) {
      state.auction = payload;
    },
    closePosResponseModal(state) {
      state.posResponseModal.isOn = false;
      state.posResponseModal.tableNumber = '';
    },
    optionSoldOutModalFlag(state, payload) {
      state.optionSoldOutModal = payload;
    },
    orderModalFlag(state, payload) {
      state.orderModal = payload;
    },
    pushOrderKey(state, payload) {
      state.orderKeys.set(payload, true);
    },
    updateOrderKeys(state, payload) {
      state.orderKeys = payload;
    },
    updateCashPaymentCancelModal(state, payload) {
      state.cashPaymentCancelModal = payload;
    },
    updateCashPaymentCancelInfo(state, payload) {
      state.cashPaymentCancelInfo = payload;
    },
    updateCashPaymentRequestModal(state, payload) {
      state.cashPaymentRequestModal = payload;
    },
    updateCashPaymentRequestInfo(state, payload) {
      state.cashPaymentRequestInfo = payload;
    },
    updateCashPaymentConfirmModal(state, payload) {
      state.cashPaymentConfirmModal = payload;
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
        // const orders = [];

        // for (let item of response.data) {
        //   // api 서버에서 가공해서 주는 요청으로 변경 할 필요 있음
        //   orders.push(JSON.parse(item.json_data));
        //   console.log(item, '아이템 확인');
        // }
        const keys = new Map();
        const orders = response.data.reduce((list, item) => {
          const data = JSON.parse(item.json_data);
          data.requestIP = item.requestIP;
          data.errorMsg = item.errorMsg;

          if (!keys.has(data.order_view_key)) {
            keys.set(data.order_view_key, true);
            list.push(data);
          }

          return list;
        }, []);

        commit('updateOrderKeys', keys);
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
    async requestLastOrder(context, params) {
      const url = endpoints.orders.controlLastOrder;
      const response = await axios.post(url,params);

      if (response.data) {
        return response.data;
      }
      return false;
    },
    async requestDeleteLastOrder(context, params) {
      const url = endpoints.orders.deleteLastOrder;
      const response = await axios.post(url,params);

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
      Vue.set(state, 'stores', stores);
    },
    updateStandardPriceUnit(state, payload) {
      state.standardPriceUnit = payload;
      if (payload === '원') {
        // 화폐단위가 '원'이면 가격 뒤에 표시
        state.standardPriceFrontPosition = false;
      } else {
        // 화폐단위가 '$', '¥'이면 가격 앞에 표시
        state.standardPriceFrontPosition = true;
      }
    },
    updateIsTorderTwo(state, payload) {
      state.isTorderTwo = payload;
    },
    updateStoreTheme(state, payload) {
      state.storeTheme = payload;
    },
    updateIsRemakePaid(state, payload) {
      state.isRemakePaid = payload;
    },
  },
  actions: {
    setStores: ({ commit }, stores) => {
      commit('SET_STORES', stores);
    },
    async setStoreInit({ commit }, params) {
      try {
        const url = endpoints.shop.config;
        const response = await axios.post(url, params);
        // // console.log(response);

        const target = response.data.data;
        // console.log('target', target);

        const device = {
          serviceStatus: !!target.T_order_store_close,
          orderStatus: !!target.T_order_store_close_order,
          recentOrderStatus: !!target.T_order_recent_order_hide,
        };

        commit('setDeviceStatus', device);
        commit('updateStandardPriceUnit', target.standardPriceUnit);
        commit('updateIsTorderTwo', target.T_order_store_tablet_version.includes('order2'));
        commit('updateIsRemakePaid', target.T_order_store_tablet_version.includes('remake'));
        commit('updateStoreTheme', target.T_order_store_Theme);
        return response;
      } catch (error) {
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
      Vue.set(state, 'device', device);
    },
    setDeviceOrderStatus(state, orderStatus) {
      state.device.orderStatus = Boolean(orderStatus);
    },
    setDeviceServiceStatus(state, serviceStatus) {
      state.device.serviceStatus = Boolean(serviceStatus);
    },
    setDeviceRecentOrderStatus(state, recentOrderStatus) {
      state.device.recentOrderStatus = Boolean(recentOrderStatus);
    },
    setDeviceKitchenOrderStatus(state, kitchenOrderStatus) {
      state.device.kitchenOrderStatus = Boolean(kitchenOrderStatus);
    },
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
        // console.log(error);
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
        // console.log(error);
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
        // console.log(error);
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
        // console.log(error);
        return false;
      }
    },
    async setShowRecentOrder(context, params) {
      try {
        const url = endpoints.device.showRecentOrder;
        const response = await axios.post(url, params);

        if (response) {
          return true;
        }

        return false;
      } catch (error) {
        // console.log(error);
        return false;
      }
    },
    async setCloseRecentOrder(context, params) {
      try {
        const url = endpoints.device.hideRecentOrder;
        const response = await axios.post(url, params);

        if (response) {
          return true;
        }

        return false;
      } catch (error) {
        // console.log(error);
        return false;
      }
    },
    async setShowKitchenOrder(context, params) {
      try {
        const url = endpoints.device.showKitchenOrder;
        const response = await axios.post(url, params);

        if (response) {
          return true;
        }

        return false;
      } catch (error) {
        // console.log(error);
        return false;
      }
    },
    async setCloseKitchenOrder(context, params) {
      try {
        const url = endpoints.device.hideKitchenOrder;
        const response = await axios.post(url, params);

        if (response) {
          return true;
        }

        return false;
      } catch (error) {
        // console.log(error);
        return false;
      }
    },
  },
};

const table = {
  mutations: {
    SET_TABLES: (state, tables) => Vue.set(state, 'tables', tables),
    SET_TABLE_CART_LIST: (state, cartList) => Vue.set(state, 'cartList', cartList),
    SHOW_ALL_REFRESH_MODAL: (state) => Vue.set(state, 'visibleAllRefreshModal', true),
    CLOSE_ALL_REFRESH_MODAL: (state) => Vue.set(state, 'visibleAllRefreshModal', false),
    SET_ALL_REFRESH_LIST: (state, allRefreshList) => Vue.set(state, 'allRefreshList', allRefreshList),
  },
  actions: {
    async setTables({ commit }, payload) {
      const str = querystring.stringify(payload);
      const query = `?${str}`;
      const url = `${endpoints.table.getTableList}${query}`;

      const response = await axios.get(url);

      if (response.data && response.data.data) {
        const results = response.data.data.map((item) => ({ ...item, ordering: false, orderStatus: true, }));
        commit('SET_TABLES', results);
        return results;
      }

      return [];
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
        // console.log(res);

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
        // // console.log(res);
        return res;
      } catch (error) {
        return false;
      }
    },
    async allTabletReload(context, params) {
      try {
        const url = endpoints.tablet.allRefresh;

        await axios.post(url, params);
        // const res = await axios.post(url, params);
        // console.log(res);
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
    SET_ALL_CATEGORIES: (state, categories) => Vue.set(state, 'allCategories', categories),
    SET_MENU_USE: (state, targetCategory) => {
      if (state.allCategories[targetCategory.index]) {
        state.allCategories[targetCategory.index].T_order_store_menu_use = targetCategory?.T_order_store_menu_use;
      }
    },
    SET_MENU_CONFIG: (state, config) => Vue.set(state, 'menuConfig', config),
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
    async setGoods({ commit }, params) {
      const url = endpoints.menu.getGoodsList;
      const response = await axios.post(url, params);

      if (response.data && response.data.data) {

        const data = response.data.data.filter(o => o.T_order_store_good_posYN === 0);

        commit('SET_GOODS', data);
        return data;
      }
      return false;
    },
    async updateCategoryOpen(context, params) {
      const url = endpoints.menu.updateCategoryOpen;
      const response = await axios.post(url, params);

      return response;
    },
    async updateCategoryClose(context, params) {
      const url = endpoints.menu.updateCategoryClose;
      const response = await axios.post(url, params);

      return response;
    },
    async setAllCategories({ commit }, params) {
      const url = endpoints.menu.getAllCategories;
      const response = await axios.post(url, params);

      if (response && response.data) {
        commit('SET_ALL_CATEGORIES', response.data);
        return response.data;
      }
      return false;
    },
    async setMenuConfig({ commit }, params) {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };
      const url = endpoints.menu.getMenuConfig;
      const response = await axios.post(url, params, config);
      console.log('set', response, response?.data?.result);

      if (response?.data?.result) {
        const { data } = response;
        commit('SET_MENU_CONFIG', data);
        commit('SET_GOODS', data.goods);
        return data;
      }
      return false;
    },
  },
  getters: {
    getCategories(state) {
      return getCategories(state.categories);
    },
    processGoods(state) {
      return state.goods.map( p => {
        let categories = p.T_order_store_good_category;

        try {
          if (typeof categories === "string") {
            categories = JSON.parse(categories);
          }
        } catch(e) {
          // console.log(e);
        }

        if (p.T_order_store_good_image) {
          imagePreload(p.T_order_store_good_image);
        }

        return {
          categories,
          code: p.T_order_store_good_code,
          price: p.T_order_store_good_defualt_price,
          displayName: p.T_order_store_good_display_name,
          displayNameOneLine: p.T_order_store_good_display_name?.replace(/\/\//gi, " "),
          displayNameNewLine: p.T_order_store_good_display_name?.replace(/\/\//gi, "<br/>"),
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
          new: p.type_new,
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
        console.log(goods,' ss');
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
      // // console.log(results);
      return results;
    },
    getAllCategories(state) {
      return getCategories(state.allCategories);
    },

    getNewCategories(state) {
      try {
        const defineCategories = getNewCategories(state.menuConfig.categorys);
        return defineCategories;
      } catch (error) {
        return [];
      }
    },
    processNewGoods(state) {
      try {
        return state.goods.map( p => {
          let categories = p.T_order_store_good_category;
          if (!p.T_order_store_good_display_name) {
            console.log(p, '확인');
          }

          try {
            if (typeof categories === "string") {
              categories = JSON.parse(categories);
            }
          } catch(e) {
            // console.log(e);
          }

          if (p.T_order_store_good_image) {
            imagePreload(p.T_order_store_good_image);
          }

          return {
            categories,
            code: p.T_order_store_good_code,
            price: p.T_order_store_good_defualt_price,
            displayName: p.T_order_store_good_display_name,
            displayNameOneLine: p.T_order_store_good_display_name?.replace(/\/\//gi, " "),
            displayNameNewLine: p.T_order_store_good_display_name?.replace(/\/\//gi, "<br/>"),
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
            posDeleteStatus: p.T_order_store_good_posYN === "1",
            new: p.type_new,
          };
        }).sort((a, b) => a.sortNo - b.sortNo);

      } catch (error) {
        // console.log(error);
        return [];
      }
    },
    getNewCategoriesGoods(state, getters) {
      const { processNewGoods, getNewCategories } = getters;

      const getSubCategoryItem = (subCategoryItem) => {
        const defineItems = subCategoryItem.goods.map((o) => {
          const product = processNewGoods.filter((item) => String(o.code) === String(item.code) && !item.posDeleteStatus)[0];
          const defineProduct = {
            ...product,
            sortNo: o.sort,
          };
          return defineProduct;
        });

        const goods = defineItems.filter(o => o.code);

        return {
          ...subCategoryItem,
          goods,
        };
      };

      const getCategoryItem = (categoryItem) => {
        const getSubCategoryObj = (subCategoryItem) => getSubCategoryItem(subCategoryItem);
        const subCategories = categoryItem.subCategories.map(getSubCategoryObj);
        return {
          ...categoryItem,
          subCategories,
        };
      };

      const results = getNewCategories.map(getCategoryItem);
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
      // console.log('update goods type response', res);

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
    setDisconnectModalVisible(state, isDisconnectModal) {
      Vue.set(state, 'isDisconnectModal', isDisconnectModal);
    },
    closeConfirmModal(state) {
      state.confirmModal.show = false;
    },
    showConfirmModal(state, confirmModal) {
      state.confirmModal = confirmModal;
    },
  },
};

const tablet = {
  mutations: {
    setSignBoardStatus(state, status) {
      Vue.set(state, 'isDisConnectNetwork', status.visible);
      Vue.set(state, 'signboardMessage', status.message);
    },
  },
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

const confirmModalProto = {
  show: false,
  close: () => {},
  title: '',
  message: '',
  confirm: () => {},
};

const payment = {
  mutations: {
    updateAlertModalMessage(state, message) {
      state.alertModalMessage = message;
    },
    updateIsAlertModal(state, visible) {
      state.isAlertModal = visible;
    },
    updateAlertTwoBtMessage(state, payload) {
      state.alertTwoBtMessage = payload;
    },
    updateIsAlertTwoBtModal(state, payload) {
      state.isAlertTwoBtModal = payload;
    },
    setRequestCashItem(state, payload) {
      state.requestCashItem = payload;
    },
    setRequestCreditItem(state, payload) {
      state.requestCreditItem = payload;
    },
    clearRequestCashItem(state) {
      state.requestCashItem = undefined;
    },
    pushPyamentList(state, payload) {
      state.paymentList.push(payload);
    },
    updatePaymentList(state, payload) {
      const currPage = payload.curentpage;
      const allPages = payload.totalPage;
      let list = payload.list;

      const typeStrings = {
        0: { name: "현금 미결제"},
        1: { name: "현금 결제 완료"},
        2: { name: "현금 환불"},
        3: { name: "카드결제 완료"},
        4: { name: "카드 환불"},
        5: { name: "카드 취소"},
        6: { name: "현금 영수증 요청 "},
        7: { name: "현금 영수증 출력"},
        8: { name: "현금 영수증 취소"},
      };

      list.map((i) => {
        const index = i.creditType;
        console.log(index);
        let name = "";
        let item = typeStrings[index];
        if (item) {
          name = item.name;
        }
        i.creditTypeString = name;
      });

      Vue.set(state, 'paymentList', list);
      Vue.set(state, 'paymentListPage', {
        currPage,
        allPages,
      });
    },
    replacePaymentListItem(state, item) {
      const id = item.id;
      const index = state.paymentList.findIndex((i) => {
        return i.id == id;
      });
      if ( index >- 1) {

        const deepCopyArr = JSON.parse(JSON.stringify(state.paymentList));

        const typeStrings = {
          0: { name: "현금 미결제"},
          1: { name: "현금 결제 완료"},
          2: { name: "현금 환불"},
          3: { name: "카드결제 완료"},
          4: { name: "카드 환불"},
          5: { name: "카드 취소"},
          6: { name: "현금 영수증 요청 "},
          7: { name: "현금 영수증 출력"},
          8: { name: "현금 영수증 취소"},
        };

        const target = {
          ...item,
          creditTypeString: typeStrings[item.creditType].name,
        };

        deepCopyArr[index] = target;

        state.paymentList = deepCopyArr;
      }
    },
    updateItemModal(state, item) {
      state.itemModal = item;
    },
  },
  actions : {
    async updatePaymentList(context, params) {

      const url = endpoints.payment.creditDataList;
      const res = await axios.get(url, {params});

      context.commit('updatePaymentList', res.data);
    },
    async updateOldPaymentList(context, params) {

      const url = endpoints.payment.creditList;
      const res = await axios.get(url, {params});

      context.commit('updatePaymentList', res.data);
    }
  },
};

const state = {
  order: undefined,
  auction : false,
  posResponseModal : {
    isOn: false,
    tableNumber: '',
  },
  optionSoldOutModal: false,
  orderModal: false,
  orders: [],
  payloadStatus: 1,
  device: {
    serviceStatus: false,
    orderStatus: false,
    recentOrderStatus: false,
    kitchenOrderStatus: false,
  },
  auth: authProto,
  stores: [],
  tables: [],
  cartList: [],
  categories: [],
  allCategories: [],
  goods: [],
  MACAddr: '00:00:00:00:00:00',
  uCode: '',
  flashMessages: [],
  flashMessageCount: 0,
  visibleAllRefreshModal: false,
  allRefreshList: [],
  isDisConnectNetwork: false,
  signboardMessage: '',
  confirmModal: confirmModalProto,
  requestCashItem: undefined,
  requestCreditItem: {},
  paymentList: [],
  paymentListPage: {
    currPage: 3,
    allPages: 10,
  },
  currentSearchModal: null,
  itemModal: {
    currName: null,
    index: null,
    item: null,
  },
  alertModalMessage: '에레 메세지 입력하세요 기본값 입니다.',
  isAlertModal: false,
  orderKeys: new Map(),
  standardPriceUnit: '원',
  // 시작 위치: true, 종료 위치: false
  standardPriceFrontPosition: false,
  isTorderTwo: false,
  isRemakePaid: false,
  storeTheme: '',
  cashPaymentCancelModal: false,
  cashPaymentCancelInfo: {
    table: {
      name: ''
    },
    paymentInfo: {
      count: 0,
      amount: 0,
    }
  },
  cashPaymentRequestModal: false,
  cashPaymentRequestInfo: {
    tableName: '',
    amount: 0,
  },
  cashPaymentConfirmModal: false,
  alertTwoBtMessage: '',
  isAlertTwoBtModal: false,
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
  ...tablet.mutations,
  ...payment.mutations,
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
  ...payment.actions,
};

const getters = {
  ...menu.getters,
};

const modules ={
  robot,
  noticePopup,
  valet,
};

const plugins = [];

const storeInit = {
  state,
  plugins,
  mutations,
  actions,
  getters,
  modules
};

const store = new Vuex.Store(storeInit);

export default store;
