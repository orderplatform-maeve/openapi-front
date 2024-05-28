<template lang="pug">
#orderview
  CashPaymentRequestModal(v-if="cashPaymentRequestModal && (isTorderTwo || isRemakePaid)")
  cash-payment-cancel-modal(
    v-if="cashPaymentCancelModal && (isTorderTwo || isRemakePaid)"
    :goPaymentDetailsPage="goPaymentDetailsPage"
  )
  alert-modal(v-if="isAlertModal")
  auction-modal(v-if="order && auction")
  modal-order(v-if="order && orderModal")
  PosErrorModal(
    v-if="posResponseModal.isOn"
    :tableNumber="posResponseModal.tableNumber"
  )
  modal-all-refresh(
    :show="visibleAllRefreshModal"
    :close="onCloseAllRefreshModal"
    :data="allRefreshList"
  )
  flash-message
  left-menu(
    :onTouchSecretFunction="onTouchSecretFunction"
  )
  notice-popup-list-modal(
    v-if="isPopupVisible"
    :noticePopupData="getNoticePopupData"
    :noticePopupPage="getNoticePopupPage"
    :popupTouchStart="popupTouchStart"
    :popupTouchEnd="popupTouchEnd"
    :oneDayNoPopup="oneDayNoPopup"
    :closePopup="closePopup"
    :noticeEmergency="getNoticeEmergency"
  )
  router-view(
    :auth="auth"
    :orders="orders"
    :stores="stores"
    :time="time"
  )
  div(:class="getHappyTalkStyle" v-if="!isDevTeam && businessType === 'torder'")
    .wrap-happy-talk-arrow(@click="toggleHappyTalkButton")
      .wrap-triangle-arrow
        .triangle-arrow
    .wrap-happy-talk-icon(@click="openHappyTalkApplyModal")
      happy-talk
  happy-talk-apply-modal(
    v-if="isVisibleHappyTalkApplyModal"
    :phoneNumber="phoneNumber"
    :updatePhoneNumber="updatePhoneNumber"
    :closeHappyTalkApplyModal="closeHappyTalkApplyModal"
    :applyHappyTalk="applyHappyTalk"
    :isVisibleConfirmModal="isVisibleHappyTalkConfirmModal"
    :openConfirmModal="openHappyTalkConfirmModal"
    :closeConfirmModal="closeHappyTalkConfirmModal"
    :checkPhoneNumber="checkPhoneNumber"
  )
  phone-number-error-modal(
    :isVisible="isVisiblePhoneNumberErrorModal"
  )
  happy-talk-success-modal(
    :isVisible="isVisibleHappyTalkSuccessModal"
    :phoneNumber="phoneNumber"
  )
  LogoutSecret(
    v-if="isVisibleLogoutSecretModal"
    :logout="logout"
    :goSelectStore="onMoveSelectStorePage"
    :close="closeLogoutSecretModal"
    :isVisibleLogoutConfirmModal="isVisibleLogoutConfirmModal"
    :openVisibleLogoutConfirmModal="openVisibleLogoutConfirmModal"
    :closeVisibleLogoutConfirmModal="closeVisibleLogoutConfirmModal"
  )
</template>

<script>
import axios from 'axios';
import store from '@store/store';
import paths from '@router/paths';
import {
  version,
  IS_DEV_TEAM,
} from '@utils/constants';
import { Torder } from '@svg';
import {
  AlertModal,
  NoticePopupListModal,
  HappyTalkApplyModal,
  PhoneNumberErrorModal,
  HappyTalkSuccessModal,
  LogoutSecret,
  PosErrorModal,
  CashPaymentRequestModal,
} from '@components';
import {
  payments,
  happyTalk as happyTalkAction,
  shop
} from '@apis';
import { HappyTalk } from '@svg';

const {
  requestCardCancelCommit,
} = payments;

const {
  postMessage
} = happyTalkAction;

const {
  postShopConfigData,
} = shop;

export default {
  components: {
    Torder,
    'alert-modal': AlertModal,
    NoticePopupListModal,
    HappyTalk,
    HappyTalkApplyModal,
    PhoneNumberErrorModal,
    HappyTalkSuccessModal,
    LogoutSecret,
    PosErrorModal,
    CashPaymentRequestModal,
  },
  // https://vuex.vuejs.org/kr/guide/state.html#vuex-%EC%83%81%ED%83%9C%EB%A5%BC-vue-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8%EC%97%90%EC%84%9C-%EA%B0%80%EC%A0%B8%EC%98%A4%EA%B8%B0
  store,
  data() {
    return {
      orders: [],
      time: {
        now: 0,
        start: 0,
        end: 0,
      },
      paths,
      logo: 'https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/logo/torder_color_white.png',
      version,
      popupTouchStartPosition: 0,
      popupTouchEndPosition: 0,
      isOpenHappyTalk: true,
      phoneNumber: '010-',
      isVisibleHappyTalkApplyModal: false,
      isVisiblePhoneNumberErrorModal: false,
      isVisibleHappyTalkConfirmModal: false,
      isVisibleHappyTalkSuccessModal: false,
      isVisibleLogoutSecretModal: false,
      secretFunctionTouchCount: 0,
      secretFunctionTouchTimer: 0,
      isVisibleLogoutConfirmModal: false,
      isDevTeam: IS_DEV_TEAM,
      deviceUsage: {},
    };
  },
  computed: {
    order() {
      const path = this.$route.path;
      if (path === '/order' || path === '/valetPage' || path === '/valetParkingConfirm') {
        return !!this.$store.state.order;
      }

      return false;
    },
    auction() {
      return this.$store.state.auction;
    },
    posResponseModal() {
      return this.$store.state.posResponseModal;
    },
    cashPaymentCancelModal() {
      return this.$store.state.cashPaymentCancelModal;
    },
    cashPaymentRequestModal() {
      return this.$store.state.cashPaymentRequestModal;
    },
    orderModal() {
      return this.$store.state.orderModal;
    },
    isAlertModal() {
      return this.$store.state.isAlertModal;
    },
    statusTabletScreen() {
      const result = this.$store.state.device.serviceStatus;
      return !result;
    },
    statusOrder() {
      const result = this.$store.state.device.orderStatus;
      return !result;
    },
    statusRecentOrder() {
      const result = this.$store.state.device.recentOrderStatus;
      return !result;
    },
    confirmModal() {
      return this.$store.state.confirmModal;
    },
    uCode() {
      return this.$store.state.uCode;
    },
    stores() {
      const { stores } = this.$store.state;
      return stores.sort((a, b) => a.name - b.name);
    },
    device() {
      return this.$store.state.device;
    },
    auth() {
      return this.$store.state.auth;
    },
    storeName() {
      const { auth } = this;
      return auth && auth.store && auth.store.store_name;
    },
    visibleOrderButton() {
      const { auth } = this;
      return !!(auth && auth.store && auth.store.store_code);
    },
    visibleStoresButton() {
      const { stores } = this;
      return stores.length > 1;
    },
    userName() {
      const { auth } = this;
      return auth && auth.member && auth.member.name;
    },
    visibleLoginButton() {
      return !this.userName;
    },
    visibleLogoutButton() {
      return !!this.userName;
    },
    visibleAllRefreshModal() {
      return this.$store.state.visibleAllRefreshModal;
    },
    allRefreshList() {
      return this.$store.state.allRefreshList;
    },
    isDisConnectNetwork() {
      return this.$store.state.isDisConnectNetwork;
    },
    signboardMessage() {
      return this.$store.state.signboardMessage;
    },
    isPopupVisible() {
      return this.$store.state.noticePopup.isPopupVisible;
    },
    getNoticePopupData() {
      return this.$store.state.noticePopup.noticePopupData;
    },
    getNoticePopupPage() {
      return this.$store.state.noticePopup.noticePopupPage;
    },
    getStoreCode() {
      return this.$store.state.auth.store.store_code;
    },
    getNoticeEmergency() {
      return this.$store.state.noticePopup.isNoticeEmergency;
    },
    getHappyTalkStyle() {
      const happyTalkStyle = {
        'wrap-happy-talk': true,
        'close-wrap-happy-talk': !this.isOpenHappyTalk,
      };

      return happyTalkStyle;
    },
    getHappyTalkArrowStyle() {
      const happyTalkArrowStyle = {
        'triangle-right': this.isOpenHappyTalk,
        'triangle-left': !this.isOpenHappyTalk,
      };

      return happyTalkArrowStyle;
    },
    getStopRedirect() {
      return process.env.STOP_REDIRECT;
    },
    isTorderTwo() {
      return this.$store.state.isTorderTwo;
    },
    isRemakePaid() {
      return this.$store.state.isRemakePaid;
    },
    businessType() {
      return this.$store.state.menuConfig?.init.business_type;
    },

  },
  watch: {
    '$route'(to, from) {
      this.$socket.emit('log', {
        path: to.path,
        from: from.path,
      });
    },
  },
  beforeCreate() {
    let MACAddr = '';
    try {
      if (window.UUID) {
        MACAddr = window.UUID.getMacAddress();
      }
    } catch(e) {
      // console.log(e);
    }
    this.$store.commit('updateMACAddr', MACAddr);
  },
  created() {
    this.getAuthentication();
    this.observableRefresh();
  },
  mounted() {
    this.watchPayment();
    this.catchOffline();
    this.catchOnline();
    this.getUCode();
    this.loopBeep();
    if (process.env.UPLOAD_TYPE !== 'tmp') {
      this.tagetVersionRedirect();
    }
    this.initialized();
  },
  sockets: {
    connect() {
      // console.log('socket connected');
      this.beep();
    },
    orderview(message) {
      this.$socket.emit('res', message, () => {
        // console.log('socket res');
      });
    }
  },
  methods: {
    async commit(item, url) {
      console.log('commit', item);
      let data = new FormData();
      data.append('key', item.key);
      data.append('id', item.id);
      data.append('stat', item.creditStat);
      data.append('type',  item.creditType);
      data.append('storeCode', item.storeCode);
      data.append('tabletNumber', item.tabletnumber);
      data.append('tablename', item.tableName);
      data.append('orderKey', item.orderkey);
      const res =  await axios({
        method: 'post',
        url,
        data: data,
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log('commit res', res);
      return res;
    },
    showAlert(message) {
      this.$store.commit('updateAlertModalMessage', message);
      return this.$store.commit('updateIsAlertModal', true);
    },
    watchPayment() {
      window.addEventListener('message', async (event) => {
        try {
          const msg = event?.data;
          const methodName = msg?.methodName;
          if (methodName === 'callBackPayment') {
            // console.log(event);
            if (msg?.result) {
              const vanData = JSON.parse(msg.result);
              // acquirer: "삼성카드사"
              // acquirerCode: "04"
              // amount: "000000002000"
              // approvalDate: "20210311174931"
              // approvalMonth: "00"
              // approvalNumber: "36204121"
              // approvalType: "REFUND"
              // cardNumber: "536148**********"
              // deviceId: "DPT0TEST03"
              // errorMessage: ""
              // issuer: "삼성마스터카드"
              // issuerCode: "04"
              // orderKey: "TEST_TPAY_003-TEST_TPAY_003_TEST-1615452524"
              // payReqId: "TEST_TPAY_003-TEST_TPAY_003_TEST-1615452521-4x6mn"
              // paymentCompany: "KSNET"
              // paymentDate: "20210311174934"
              // paymentId: "687743457830"
              // paymentResultUpload: "N"
              // receiptType: ""
              // responseCode: "0000"
              // resultText: "success"
              // storeCode: "TEST_TPAY_003"
              // tableNo: "TEST_TPAY_003_TEST"
              // vat: "000000000000"
              if (vanData?.responseCode === "0000") {
                // 결제 취소 페이지 고고링
                console.log('결제 취소 완료', vanData);
                const requestCreditItem = this.$store?.state?.requestCreditItem;
                if (!requestCreditItem?.key) {
                  return this.showAlert(`key 값이 없습니다. 에러메세지: ${requestCreditItem?.key}`);
                }
                if (!requestCreditItem?.id) {
                  return this.showAlert(`id 값이 없습니다. 에러메세지: ${requestCreditItem?.id}`);
                }
                if (!requestCreditItem?.creditStat) {
                  return this.showAlert(`stat 값이 없습니다. 에러메세지: ${requestCreditItem?.creditStat}`);
                }
                if (!requestCreditItem?.creditType) {
                  return this.showAlert(`type 값이 없습니다. 에러메세지: ${requestCreditItem?.creditType}`);
                }
                if (!requestCreditItem?.storeCode) {
                  return this.showAlert(`storeCode 값이 없습니다. 에러메세지: ${requestCreditItem?.storeCode}`);
                }
                if (!requestCreditItem?.tabletnumber) {
                  return this.showAlert(`tabletnumber 값이 없습니다. 에러메세지: ${requestCreditItem?.tabletnumber}`);
                }
                if (!requestCreditItem?.tableName) {
                  return this.showAlert(`tableName 값이 없습니다. 에러메세지: ${requestCreditItem?.tableName}`);
                }
                if (!requestCreditItem?.orderkey) {
                  return this.showAlert(`orderkey 값이 없습니다. 에러메세지: ${requestCreditItem?.orderkey}`);
                }

                const res = await requestCardCancelCommit(vanData);
                if (res.status === 200) {
                  this.showAlert('승인 요청했습니다. 조회하여 새로고침 해주세요.');
                  if (res.data.result) {
                    const newItem = res?.data?.rowData;
                    this.$store.commit('replacePaymentListItem', newItem);
                  // if (!res.data) {
                  //   return this.showAlert(`API cardCancelCommit 응답값 data이 없습니다 아닙니다. 응답값: ${newItem}`);
                  // }
                  // if (res?.data?.length === 0) {
                  //   return this.showAlert(`API cardCancelCommit 응답값 data크기가 0입니다. 아닙니다. 응답값: ${res.data}`);
                  // }
                  // if (!newItem) {
                  //   return this.showAlert(`API cardCancelCommit 응답값 rowData이 없습니다 아닙니다. 응답값: ${newItem}`);
                  // }
                  // // newItem {id: ''}
                  // this.$store.commit('replacePaymentListItem', newItem);
                  // return this.$store.commit('updateItemModal', {
                  //   currName: null,
                  //   index: null,
                  // });
                  }
                }
                // return this.showAlert(`잘못된 response status 200이 아닙니다. status: ${res?.status}`);

                this.$store.commit('updateItemModal', {
                  currName: null,
                  index: null,
                });

                return;

              } else {
                return this.showAlert(`잘못된 responseCode 0000입니다. 에러메세지: ${vanData?.errorMessage}`);
              }
            } else {
              return this.showAlert(`잘못된 callBackPayment message 형태입니다. 출력값: ${msg?.result}`);
            }
          }
        } catch (error) {
          console.log(error);
          return this.showAlert('승인 요청했습니다. 조회하여 새로고침 해주세요.');
        }
      });
    },
    toggleTabletScreen() {
      if (this.statusTabletScreen) {
        this.closeTabletScreen();
      } else {
        this.openTabletScreen();
      }
    },
    toggleOrder() {
      if (!this.statusOrder) {
        this.agreeOrder();
      } else {
        this.rejectOrder();
      }
    },
    toggleRecentOrder() {
      if (!this.statusRecentOrder) {
        this.showRecentOrder();
      } else {
        this.hideRecentOrder();
      }
    },
    catchOffline() {
      window.addEventListener('offline', () => {
        // console.log("you're offline");
        const payload = {
          visible: true,
          message: '인터넷이 연결 되지 않았습니다. 인터넷 연결 확인 후 새로고침 해주세요.',
        };
        this.$store.commit('setSignBoardStatus', payload);
      });
    },
    catchOnline() {
      window.addEventListener('online', () => {
        // console.log("you're online");
        const payload = {
          visible: false,
          message: '',
        };
        this.$store.commit('setSignBoardStatus', payload);
      });
    },
    observableRefresh() {
      // close web tab
      window.addEventListener('beforeunload', () => {
        // console.log('beforeunload', this.$route?.params?.id);
        if (this.$route?.params?.id) {
          const { store_code } = this.$store.state.auth.store;
          const payload = {
            store: {
              code: store_code,
            },
            type: '@request/ordering/location/table',
            tableId: this.$route.params.id,
            uCode: this.$store.state.uCode,
            MACAddr: this.$store.state.MACAddr,
            ordering: false,
          };
          this.$socket.emit('orderview', payload);
        }
      // event.returnValue = 'Write something';
      });
    },
    async initialized() {
      try {
        const params = { shop_code: this.$store.state.auth.store.store_code };
        const tables = await this.$store.dispatch('setTables', params);
        tables.forEach((table) => {
          this.$socket.emit('event', {
            store: {
              code: this.$store.state.auth.store.store_code,
            },
            table: {
              code: table.Ta_id,
            },
            type: 'getSuspendSale',
          });
        });
      } catch (error) {
        console.log('여긴가?');
        // console.log(error);
      }
    },
    async tagetVersionRedirect() {
      try {
        if (this.$store.state.auth?.store?.store_code) {
          const params = new FormData();
          params.append('store_code', this.$store.state.auth.store.store_code);
          const res = await this.$store.dispatch('setStoreInit', params);
          // // console.log('tagetVersionRedirect', res);
          const nextUrl = res.data.data.T_order_store_orderView_version;
          if (nextUrl) {
            const {
              protocol,
              hostname,
              pathname,
            } = location;
            const nowPath = `${protocol}//${hostname}${pathname}#/`;
            // console.log('location', nowPath, nextUrl);
            if (!this.getStopRedirect) {
              if (nowPath !== nextUrl) {
                return location.replace(nextUrl);
              }
            }
          }
          return false;
        }
      } catch (error) {
        return false;
      }
    },
    visibleSideMenu() {
      const targetPath = this.$router.history.current.path;
      const isLoginPath = targetPath === '/login';
      const isStorePath = targetPath === '/store';
      const isFalse = isLoginPath || isStorePath;
      if (isFalse) return false;
      return true;
    },
    logout() {
      this.$store.dispatch('logout');
      localStorage.removeItem('auth');
      this.$router.replace(paths.login);
      this.closeLogoutSecretModal();
    },
    restart() {
      // location.href = '/'; // cache 파일을 먼저 로드한다.
      location.replace('/'); // cache 파일을 로드하지 않는다.
    },
    openTabletScreen() {
      if (!this.$store.state.device.serviceStatus) {
        return this.$store.commit('pushFlashMessage', '이미 태블릿 열기 상태로 되어있습니다.');
      }
      const confirmModal = {};
      confirmModal.show = true;
      confirmModal.close = this.closeConfirmModal;
      confirmModal.title = '태블릿 열기';
      confirmModal.message = '모든 태블릿의 화면을 열어요';
      confirmModal.confirm = this.reqOpenTablet;
      this.$store.commit('showConfirmModal', confirmModal);
    },
    closeTabletScreen() {
      if (this.$store.state.device.serviceStatus) {
        return this.$store.commit('pushFlashMessage', '이미 태블릿 닫기 상태로 되어있습니다.');
      }
      const confirmModal = {};
      confirmModal.show = true;
      confirmModal.close = this.closeConfirmModal;
      confirmModal.title = '태블릿 닫기';
      confirmModal.message = '모든 태블릿의 화면을 닫아요';
      confirmModal.confirm = this.reqCloseTablet;
      this.$store.commit('showConfirmModal', confirmModal);
    },
    agreeOrder() {
      if (!this.$store.state.device.orderStatus) {
        return this.$store.commit('pushFlashMessage', '이미 주문 받기 상태로 되어있습니다.');
      }
      const confirmModal = {};
      confirmModal.show = true;
      confirmModal.close = this.closeConfirmModal;
      confirmModal.title = '주문 받기';
      confirmModal.message = '태블릿에서 주문을 받아요';
      confirmModal.confirm = this.reqAgreeOrder;
      this.$store.commit('showConfirmModal', confirmModal);
    },
    rejectOrder() {
      if (this.$store.state.device.orderStatus) {
        return this.$store.commit('pushFlashMessage', '이미 주문 중단 상태로 되어있습니다.');
      }
      const confirmModal = {};
      confirmModal.show = true;
      confirmModal.close = this.closeConfirmModal;
      confirmModal.title = '주문 중단';
      confirmModal.message = '태블릿을 메뉴판으로만 사용하고 주문은 안돼요';
      confirmModal.confirm = this.reqRejectOrder;
      this.$store.commit('showConfirmModal', confirmModal);
    },
    showRecentOrder() {
      if (!this.$store.state.device.recentOrderStatus) {
        return this.$store.commit('pushFlashMessage', '이미 주문 내역 표시 상태로 되어있습니다.');
      }
      const confirmModal = {};
      confirmModal.show = true;
      confirmModal.close = this.closeConfirmModal;
      confirmModal.title = '주문 내역 표시';
      confirmModal.message = '태블릿에서 주문 내역이 나타납니다';
      confirmModal.confirm = this.reqShowOrder;
      this.$store.commit('showConfirmModal', confirmModal);
    },
    hideRecentOrder() {
      if (this.$store.state.device.recentOrderStatus) {
        return this.$store.commit('pushFlashMessage', '이미 주문 내역 숨김 상태로 되어있습니다.');
      }
      const confirmModal = {};
      confirmModal.show = true;
      confirmModal.close = this.closeConfirmModal;
      confirmModal.title = '주문 내역 숨김';
      confirmModal.message = '태블릿에서 주문 내역이 숨겨집니다';
      confirmModal.confirm = this.reqHideOrder;
      this.$store.commit('showConfirmModal', confirmModal);
    },
    closeConfirmModal() {
      this.$store.commit('closeConfirmModal');
    },
    async reqOpenTablet() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.store_code);
      const response = await this.$store.dispatch('setOpenTablet', fd);
      if (response) {
        const value = 0;
        const { disconnected } = this.emitServiceStatus(value);
        if (disconnected) {
          this.$store.commit('setDeviceServiceStatus', value);
          this.$store.commit('pushFlashMessage', '태블릿 화면 열기 상태로 변경 되었습니다.');
        }
        this.closeConfirmModal();
      }
    },
    async reqCloseTablet() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.store_code);
      const response = await this.$store.dispatch('setCloseTablet', fd);
      if (response) {
        const value = 1;
        const { disconnected } = this.emitServiceStatus(value);
        if (disconnected) {
          this.$store.commit('setDeviceServiceStatus', value);
          this.$store.commit('pushFlashMessage', '태블릿 화면 닫기 상태로 변경 되었습니다.');
        }
        this.closeConfirmModal();
      }
    },
    async reqAgreeOrder() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.store_code);
      const response = await this.$store.dispatch('setAgreeOrder', fd);
      if (response) {
        const value = 0;
        const { disconnected } = this.emitAgreeOrder(value);
        if (disconnected) {
          this.$store.commit('setDeviceOrderStatus', value);
          this.$store.commit('pushFlashMessage', '태블릿 주문 받기 상태로 변경 되었습니다.');
        }
        this.closeConfirmModal();
      }
    },
    async reqRejectOrder() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.store_code);
      const response = await this.$store.dispatch('setRejectOrder', fd);
      if (response) {
        const value = 1;
        const { disconnected } = this.emitAgreeOrder(value);
        if (disconnected) {
          this.$store.commit('setDeviceOrderStatus', value);
          this.$store.commit('pushFlashMessage', '태블릿 주문 중단 상태로 변경 되었습니다.');
        }
        this.closeConfirmModal();
      }
    },
    async reqShowOrder() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.store_code);
      const response = await this.$store.dispatch('setShowRecentOrder', fd);
      if (response) {
        const value = 0;
        const { disconnected } = this.emitRecentOrder(value);
        if (disconnected) {
          this.$store.commit('setDeviceRecentOrderStatus', value);
          this.$store.commit('pushFlashMessage', '태블릿 주문 내역 표시 상태로 변경 되었습니다.');
        }
        this.closeConfirmModal();
      }
    },
    async reqHideOrder() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.store_code);
      const response = await this.$store.dispatch('setCloseRecentOrder', fd);
      if (response) {
        const value = 1;
        const { disconnected } = this.emitRecentOrder(value);
        if (disconnected) {
          this.$store.commit('setDeviceRecentOrderStatus', value);
          this.$store.commit('pushFlashMessage', '태블릿 주문 내역 숨김 상태로 변경 되었습니다.');
        }
        this.closeConfirmModal();
      }
    },
    emitServiceStatus(value) {
      const { store_code } = this.$store.state.auth.store;
      const payload = {
        store: {
          code: store_code,
        },
        type: '@update/device/serviceStatus',
        value,
      };
      return this.$socket.emit('orderview', payload);
    },
    emitAgreeOrder(value) {
      const { store_code } = this.$store.state.auth.store;
      const payload = {
        store: {
          code: store_code,
        },
        type: '@update/device/agreeOrder',
        value,
      };
      return this.$socket.emit('orderview', payload);
    },
    emitRecentOrder(value) {
      const { store_code } = this.$store.state.auth.store;
      const payload = {
        store: {
          code: store_code,
        },
        type: '@update/device/recentOrder',
        value,
      };
      return this.$socket.emit('orderview', payload);
    },
    async beep() {
      const time = Date.now();
      const ISONow = new Date(time).toISOString();
      const datetime = this.$moment(ISONow).format();
      try {
        window.UUID?.getDeviceUsage();
      } catch(e) {
        //// console.log(e);
      }

      const data = {
        type: 'beep',
        uCode: this.$store.state.uCode,
        MACAddr: this.$store.state.MACAddr,
        deviceUsage: this.deviceUsage,
        location: window.location,
        store: {
          code: this.$store.state.auth?.store?.code,
        },
        time: time,
        path: this.$route.path,
        datetime: datetime,
      };

      this.$socket.emit('event', data, () => {
        // // console.log('event', answer.msg);
      });

      const isDev = process.env.STOP_REDIRECT;
      const isLogined = this.auth.store.store_code.length > 1;

      try {
        if (!isDev && isLogined) {
          const { store_code } = this.auth.store;

          const params = new FormData();
          params.append('store_code', store_code);

          const res = await postShopConfigData(params);

          console.log('event emit');
          let nextUrl = res.data.data.T_order_store_orderView_version;

          if (nextUrl) {
            const {
              origin,
              pathname
            } = location;

            const nowPath = `${origin}${pathname}#/`;

            if (nextUrl.includes('torder.io')) {
              nextUrl = `${nextUrl}#/login?store_code=${store_code}`;
            }

            // diff version
            if (nowPath !== nextUrl) {
              return location.replace(nextUrl);
            }
          }
        }
      } catch (error) {
        console.error('버전 리디렉션 에러 : \n', error);
      }
    },
    getAuthentication() {
      try {
        const params = { store_code: this.auth.store.store_code };
        const auth = JSON.parse(localStorage.auth);
        this.$socket.emit('reqStoreInfo', params);
        this.$store.commit('SET_AUTH', auth);

        if (auth.store.code) {
          const data = {
            storeCode: auth.store.code,
            tableCode: '',
          };

          window.UUID.setStoreCode(JSON.stringify(data));
        }
      } catch {
        console.log('안드로이드가 아니라 발생하는 에러 / 신경안써도 됨');
      }
    },
    getUCode() {
      // get uCode from localStorage
      let uCode = localStorage.getItem('uCode');
      // create uCode if no code
      if (!uCode) {
        uCode = '';
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < 5; i++ ) {
          uCode += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        // set uCode to localStorage
        localStorage.setItem('uCode', uCode);
      }
      this.$store.commit('updateUCode', uCode);
    },
    loopBeep() {
      this.beep();
      setInterval(() => {
        this.time.now = parseInt(Date.now());
        const timestemp = parseInt(Date.now() / 1000);
        const lap = timestemp % 30;
        const term = lap < 1;
        if (term) {
          // console.log('term', new Date());
          this.beep();
        }
      }, 1000);
    },
    onCloseAllRefreshModal() {
      this.$store.commit('CLOSE_ALL_REFRESH_MODAL');
      this.$store.commit('SET_ALL_REFRESH_LIST', []);
    },
    getNowDate() {
      if (!this.time.now) {
        return '';
      }
      const now = new Date(this.time.now);
      const ISONow = now.toISOString();
      return this.$moment(ISONow).format('MM.DD HH:mm:ss');
    },
    popupTouchStart(e) {
      this.popupTouchStartPosition = e.changedTouches[0].screenX;
    },
    popupTouchEnd(e) {
      const endPosition = e.changedTouches[0].screenX;

      if (this.popupTouchStartPosition > endPosition + 40) {
        this.$store.commit('noticePopup/noticePopupNext');
      } else if (this.popupTouchStartPosition + 40 < endPosition) {
        this.$store.commit('noticePopup/noticePopupPrevious');
      }
    },
    closePopup() {
      this.$store.commit('noticePopup/updatePopupVisible', false);
      this.$store.commit('noticePopup/updateNoticeEmergency', false);
      this.$store.commit('noticePopup/updateNoticePopupData', []);
    },
    oneDayNoPopup() {
      this.$cookies.set('NoVisiblePopup', true);
      this.closePopup();
    },
    openHappyTalk() {
      this.isOpenHappyTalk = true;
    },
    closeHappyTalk() {
      this.isOpenHappyTalk = false;
    },
    toggleHappyTalkButton() {
      if (!this.isOpenHappyTalk) {
        this.openHappyTalk();
        return;
      }
      this.closeHappyTalk();
    },
    autoHypenPhone(str){
      const regExp = str.replace(/[^0-9]/g, '');

      if( regExp.length < 4){
        return regExp;
      }

      let phoneNumberPlusHypen = '';

      if(regExp.length < 8){
        phoneNumberPlusHypen += regExp.substr(0, 3);
        phoneNumberPlusHypen += '-';
        phoneNumberPlusHypen += regExp.substr(3);

        return phoneNumberPlusHypen;
      }

      phoneNumberPlusHypen += regExp.substr(0, 3);
      phoneNumberPlusHypen += '-';
      phoneNumberPlusHypen += regExp.substr(3, 4);
      phoneNumberPlusHypen += '-';
      phoneNumberPlusHypen += regExp.substr(7);

      return phoneNumberPlusHypen;
    },
    updatePhoneNumber(key) {
      if (/^\d+$/g.test(key)) {
        //this.phoneNumber += String(key.code);

        if (this.phoneNumber.length < 13) {
          this.phoneNumber = this.autoHypenPhone(this.phoneNumber + String(key));
        }
      } else if(key=='d') {
        this.phoneNumber = this.autoHypenPhone(this.phoneNumber.slice(0,-1));
        //this.phoneNumber = this.phoneNumber.slice(0,-1);
      } else if(key=='r') {
        this.phoneNumber = '010-';
      }
    },
    openHappyTalkApplyModal() {
      this.isVisibleHappyTalkApplyModal = true;
    },
    closeHappyTalkApplyModal() {
      this.isVisibleHappyTalkApplyModal = false;
    },
    openPhoneNumberErrorModal() {
      this.isVisiblePhoneNumberErrorModal = true;
    },
    closePhoneNumberErrorModal() {
      this.isVisiblePhoneNumberErrorModal = false;
    },
    checkPhoneNumber() {
      if (this.phoneNumber.length !== 13) {
        this.openPhoneNumberErrorModal();
        setTimeout(() => {
          this.closePhoneNumberErrorModal();
        }, 1500);
        return;
      }

      this.openHappyTalkConfirmModal();

    },
    openHappyTalkConfirmModal() {
      this.isVisibleHappyTalkConfirmModal = true;
    },
    closeHappyTalkConfirmModal() {
      this.isVisibleHappyTalkConfirmModal = false;
    },
    openHappyTalkSuccessModal() {
      this.isVisibleHappyTalkSuccessModal = true;
    },
    closeHappyTalkSuccessModal() {
      this.updatePhoneNumber('r');
      this.isVisibleHappyTalkSuccessModal = false;
    },
    async applyHappyTalk() {
      try {
        const res = await postMessage(this.getStoreCode, this.phoneNumber);

        if (res.data?.code !== 200) {
          const errorMessage = res.data?.message || '상담 신청에 실패하였습니다.';
          this.$store.commit('pushFlashMessage', errorMessage);
          return;
        }

        this.openHappyTalkSuccessModal();
        setTimeout(() => {
          this.closeHappyTalkSuccessModal();
        }, 1500);

        this.closeHappyTalkConfirmModal();
        this.closeHappyTalkApplyModal();
      } catch(error) {
        console.log(error, '에러');
      }
    },
    openLogoutSecretModal() {
      this.isVisibleLogoutSecretModal = true;
    },
    closeLogoutSecretModal() {
      this.isVisibleLogoutSecretModal = false;
      this.closeVisibleLogoutConfirmModal();
    },
    plusSecretFunctionTouchCount() {
      this.secretFunctionTouchCount += 1;
    },
    resetSecretFunctionTouchCount() {
      this.secretFunctionTouchCount = 0;
    },
    onTouchSecretFunction() {
      const isDev = process.env.STOP_REDIRECT;

      if (isDev) {
        this.openLogoutSecretModal();
        return;
      }

      this.plusSecretFunctionTouchCount();
      const isOpenCount = this.secretFunctionTouchCount > 4;
      if (isOpenCount) {
        this.openLogoutSecretModal();
        this.resetSecretFunctionTouchCount();
        return;
      }

      if (this.secretFunctionTouchTimer)  {
        clearTimeout(this.secretFunctionTouchTimer);
      }
      this.secretFunctionTouchTimer = setTimeout(function() {
        this.resetSecretFunctionTouchCount();
      }.bind(this), 1000);
    },
    onMoveSelectStorePage() {
      this.closeLogoutSecretModal();
      this.$router.push('/store');
    },
    openVisibleLogoutConfirmModal() {
      this.isVisibleLogoutConfirmModal = true;
    },
    closeVisibleLogoutConfirmModal() {
      this.isVisibleLogoutConfirmModal = false;
    },
    goPaymentDetailsPage() {
      if (this.$route.path !== '/paymentDetails') {
        this.$router.push('/paymentDetails');
      }
      this.$store.commit('updateCashPaymentCancelModal', false);
    }
  },
};
</script>
<style lang="scss" scoped>
.wrap-happy-talk {
  position: fixed;
  right: -1.3889vw;
  bottom: 1.5vw;
  width: 13.140625vw;
  height: 6.03125vw;
  display: flex;
  align-items: center;
  transition: transform 0.5s linear;

  .wrap-happy-talk-arrow {
    width: 2.1875vw;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;

    .wrap-triangle-arrow {
      padding: 1.8vw 0.78125vw 2vw 2vw !important;
      box-sizing: border-box;
      border-right: solid 0.15625vw #391b1b;

      .triangle-arrow {
        width: 0;
        height: 0;
        border-top: 0.6859375vw solid transparent;
        border-bottom: 0.6859375vw solid transparent;
        border-left: 0.6859375vw solid  #000;
        border-right: none;
      }
    }
  }

  .wrap-happy-talk-icon {
    position: absolute;
  }
}

.close-wrap-happy-talk {
  transform: translateX(9.1vw);
  .wrap-happy-talk-arrow {
    .wrap-triangle-arrow {
      .triangle-arrow {
        width: 0;
        height: 0;
        border-top: 0.6859375vw solid transparent;
        border-right: 0.6859375vw solid #391b1b;
        border-bottom: 0.6859375vw solid transparent;
        border-left: none;
      }
    }
  }
}
</style>
