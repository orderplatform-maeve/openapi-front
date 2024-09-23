<template lang="pug">
.left-menu-container
  modal-confirm(
    :show="confirmModal.show"
    :close="confirmModal.close"
    :title="confirmModal.title"
    :message="confirmModal.message"
    :confirm="confirmModal.confirm"
  )
  .torder-logo
    icon-uplus-logo(v-if='isUplus')
    icon-torder-logo(v-else)
  .wrap-current-date(@click="onTouchSecretFunction")
    p.current-date {{getNowDate()}}
    p.current-time {{getNowTime()}}
  .wrap-page-button-list
    router-link.order-history.wrap-notice(v-if="visibleOrderButton && businessType === 'torder'" :to="paths.notice" :class="{activeButton: path === '/notice'}")
      span 공지사항
      p.big-title {{getNoticeQuantity}}
    router-link.order-history(v-if="visibleOrderButton" :to="paths.order" :class="{activeButton: path === '/order'}") 주문보기
    router-link.additional-functions(
      v-if="visibleOrderButton"
      :to="paths.additional"
      :class="{activeButton: additionalPath}"
    )
      span 추가기능
      img(src="https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/icons/beta_w.png")
    router-link.paid-history(v-if="visibleOrderButton" :to="getPaidHistoryPath()" :class="{activeButton: path === getPaidHistoryPath()}") 결제내역
    router-link(v-if="visibleOrderButton && (isTorderTwo || isRemakePaid)" :to="paths.holdPaymentOrder" :class="{activeButton: path === '/holdPaymentOrder'}") 결제 보류 처리
  .wrap-bottom-button-area
    .on-off-button-list
      .wrap-on-off-button
        p 테블릿 화면
        .wrap-on-off-switch
          .on-off-switch(v-on:click.stop="closeTabletScreen" :class="{activeSwitch: !statusTabletScreen}") OFF
          .on-off-switch(v-on:click.stop="openTabletScreen" :class="{activeSwitch: statusTabletScreen}") ON
      .wrap-on-off-button
        p 테블릿 주문
        .wrap-on-off-switch
          .on-off-switch(v-on:click.stop="rejectOrder" :class="{activeSwitch: !statusOrder}") OFF
          .on-off-switch(v-on:click.stop="agreeOrder" :class="{activeSwitch: statusOrder}") ON
      .wrap-on-off-button
        p 주문 내역
        .wrap-on-off-switch
          //- label.on-off-switch(v-on:click.stop="toggleRecentOrder" :class="{switchOff: !statusRecentOrder, switchOn: statusRecentOrder}")
          //-   input(type='checkbox' :checked="statusRecentOrder" disabled="disabled")
          .on-off-switch(v-on:click.stop="hideRecentOrder" :class="{activeSwitch: !statusRecentOrder}") OFF
          .on-off-switch(v-on:click.stop="showRecentOrder" :class="{activeSwitch: statusRecentOrder}") ON
    button.wrap-refresh-button(@click="restart")
      p 새로고침
      icon-refresh-icon
    //- button.wrap-logout-button(v-if="visibleLogoutButton" @click="logout")
    //-   p 로그아웃
    //-   icon-logout-icon
</template>

<script>
import { version, IS_UPLUS } from '@utils/constants';
import paths from '@router/paths';
import { notice } from '@apis';

const {
  getNoticeInfo,
} = notice;

export default {
  props: {
    onTouchSecretFunction: {
      type: Function,
      required: true,
    }
  },
  data() {
    return {
      time: {
        now: 0,
        start: 0,
        end: 0,
      },
      version,
      paths,
      noticeData: {
        totalContentCount: 10,
        pageSize: 10,
        currentPage: 0,
        maxPageNo: 1,
        noticeMasterList: [],
        newStatus: 0,
        noticeNewCount: 0,
      },
      deviceUsage: {},
      isUplus: IS_UPLUS,
    };
  },
  methods: {
    restart() {
      // location.href = '/'; // cache 파일을 먼저 로드한다.
      location.reload();
    },
    logout() {
      this.$store.dispatch('logout');
      localStorage.removeItem('auth');
      this.$router.replace(paths.login);
    },
    getNowDate() {
      if (!this.time.now) {
        return '';
      }
      const now = new Date(this.time.now);
      const ISONow = now.toISOString();

      return this.$moment(ISONow).format('MM월 DD일');
    },
    getNowTime() {
      if (!this.time.now) {
        return '';
      }
      const now = new Date(this.time.now);
      const ISONow = now.toISOString();

      return this.$moment(ISONow).format('HH:mm:ss');
    },
    beep() {
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
    closeTabletScreen() {
      // if (this.$store.state.device.serviceStatus) {
      //   return this.$store.commit('pushFlashMessage', '이미 태블릿 닫기 상태로 되어있습니다.');
      // }

      const confirmModal = {};

      confirmModal.show = true;
      confirmModal.close = this.closeConfirmModal;
      confirmModal.title = '태블릿 닫기';
      confirmModal.message = '모든 태블릿의 화면을 닫아요';
      confirmModal.confirm = this.reqCloseTablet;

      this.$store.commit('showConfirmModal', confirmModal);
    },
    openTabletScreen() {
      // if (!this.$store.state.device.serviceStatus) {
      //   return this.$store.commit('pushFlashMessage', '이미 태블릿 열기 상태로 되어있습니다.');
      // }
      const confirmModal = {};
      confirmModal.show = true;
      confirmModal.close = this.closeConfirmModal;
      confirmModal.title = '태블릿 열기';
      confirmModal.message = '모든 태블릿의 화면을 열어요';
      confirmModal.confirm = this.reqOpenTablet;
      this.$store.commit('showConfirmModal', confirmModal);
    },
    agreeOrder() {
      // if (!this.$store.state.device.orderStatus) {
      //   return this.$store.commit('pushFlashMessage', '이미 주문 받기 상태로 되어있습니다.');
      // }
      const confirmModal = {};
      confirmModal.show = true;
      confirmModal.close = this.closeConfirmModal;
      confirmModal.title = '주문 받기';
      confirmModal.message = '태블릿에서 주문을 받아요';
      confirmModal.confirm = this.reqAgreeOrder;
      this.$store.commit('showConfirmModal', confirmModal);
    },
    rejectOrder() {
      // if (this.$store.state.device.orderStatus) {
      //   return this.$store.commit('pushFlashMessage', '이미 주문 중단 상태로 되어있습니다.');
      // }
      const confirmModal = {};
      confirmModal.show = true;
      confirmModal.close = this.closeConfirmModal;
      confirmModal.title = '주문 중단';
      confirmModal.message = '태블릿을 메뉴판으로만 사용하고 주문은 안돼요';
      confirmModal.confirm = this.reqRejectOrder;
      this.$store.commit('showConfirmModal', confirmModal);
    },
    showRecentOrder() {
      // if (!this.$store.state.device.recentOrderStatus) {
      //   return this.$store.commit('pushFlashMessage', '이미 주문 내역 표시 상태로 되어있습니다.');
      // }
      const confirmModal = {};
      confirmModal.show = true;
      confirmModal.close = this.closeConfirmModal;
      confirmModal.title = '주문 내역 표시';
      confirmModal.message = '태블릿에서 주문 내역이 나타납니다';
      confirmModal.confirm = this.reqShowOrder;
      this.$store.commit('showConfirmModal', confirmModal);
    },
    hideRecentOrder() {
      // if (this.$store.state.device.recentOrderStatus) {
      //   return this.$store.commit('pushFlashMessage', '이미 주문 내역 숨김 상태로 되어있습니다.');
      // }
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
    async getDefaultNoticeData() {
      try {
        const res = await getNoticeInfo(`page=0&size=8&noticeCategoryList=EVENT,UPDATE,NOTICE,NEWS&noticeStatusList=1&noticeSearchQuery=&noticeCaller=MASTER&storeCode=${this.getStoreCode}`);

        if (res.status === 200) {
          const data = res.data;
          this.$store.commit('noticePopup/updateNoticeQuantity', data.noticeNewCount);
        }
      } catch {
        console.log('에러');
      }
    },
    async getConfigData() {
      this.isLoading = true;

      const fd = new FormData();
      fd.append('store_code', this.$store.state.auth.store.store_code);
      fd.append('api_type', 1);

      await this.$store.dispatch('setMenuConfig', fd);
    },
    getPaidHistoryPath() {
      return this.isTorderTwo || this.isRemakePaid ? paths.paymentDetails : paths.paymentManagement;
    }
  },
  // created() {
  //   this.getDefaultNoticeData();
  // },
  mounted() {
    this.loopBeep();
    this.getDefaultNoticeData();
    this.getConfigData();
  },
  computed: {
    getNoticeQuantity() {
      return this.$store.state.noticePopup.noticeQuantity;
    },
    statusOrder() {
      const result = this.$store.state.device.orderStatus;
      return !result;
    },
    statusRecentOrder() {
      const result = this.$store.state.device.recentOrderStatus;
      return !result;
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
    visibleOrderButton() {
      const { auth } = this;
      return !!(auth && auth.store && auth.store.store_code);
    },
    storeName() {
      const { auth } = this;
      return auth && auth.store && auth.store.store_name;
    },
    statusTabletScreen() {
      const result = this.$store.state.device.serviceStatus;
      return !result;
    },
    auth() {
      return this.$store.state.auth;
    },
    path() {
      return this.$route.path;
    },
    additionalPath() {
      const pathList = [
        '/additional',
        '/newProducts',
        '/updateCategories',
        '/tables',
        '/pickUpTables',
        '/controlOrder',
        '/controlLastOrder',
        '/cancelPaymentOrder',
        '/oldPaymentManagement',
        '/newPaymentManagement',
        '/servingRobotManagement',
        '/auctionManager',
        '/gameManagement',
        '/valetTableList',
        '/ordersIP',
        '/tableOrders'
      ];

      if (pathList.indexOf(this.path) !== -1) {
        return true;
      }

      return false;
    },
    confirmModal() {
      return this.$store.state.confirmModal;
    },
    getNoticeNewCount() {
      return this.noticeData.noticeNewCount;
    },
    getStoreCode() {
      return this.$store.state.auth.store.store_code;
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
  }
};
</script>

<style lang="scss" scoped>
.left-menu-container {
  font-family: 'Spoqa Han Sans Neo', 'sans-serif';
  position: relative;
  width: 15.46875vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1.171875vw 0 0 !important;
  box-sizing: border-box !important;
  overflow: auto;

  .torder-logo {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .wrap-current-date {
    padding: 0 1.171875vw !important;
    margin: 1.5vw 0 0 !important;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    user-select: none;

    .current-date {
      font-size: 1.71875vw;
      letter-spacing: -0.02578125vw;
    }

    .current-time {
      font-size: 2.578125vw;
      font-weight: bold;
      letter-spacing: -0.0390625vw;
    }
  }

  .wrap-page-button-list {
    width: 100%;
    padding: 1.5625vw 1.171875vw 0 !important;
    display: flex;
    flex-direction: column;
    gap: 0.78125vw;
    box-sizing: border-box;
    user-select: none;

    > a {
      width: 100%;
      height: 3.90625vw;
      font-size: 1.40625vw !important;
      letter-spacing: 0.03515625vw;
      background-color: #12151d;
      border: none;
      border-radius: 1.015625vw;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ddd !important;
    }

    .additional-functions {
      display: flex;
      align-items: center;

      > img {
        width: 2.34375vw;
        align-self: flex-start;
        transform: translateY(50%);
        font-weight: bold;
      }
    }

    .activeButton {
      background-color: #fc0000;
      font-weight: bold;
      color: #fff !important;
    }

    .order-history {
      display: flex;
      align-items: center;
      gap: 0.390625vw;
    }

    .wrap-notice {
      position: relative;

      .big-title {
        position: absolute;
        right: 0;
        top: 0;
        width: 3.90625vw;
        height: 2.34375vw;
        border-radius: 1.171875vw;
        border: solid 0.156250vw #fc0000;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        transform: translateY(-50%);
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        font-size: 1.875;
        font-weight: bold;
        letter-spacing: -0.046875vw;
        color: #fc0000;
      }
    }
  }

  .wrap-bottom-button-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    .on-off-button-list {
      padding: 2.890625vw 1.171875vw !important;
      border-top: solid 0.078125vw #000;
      border-bottom: solid 0.078125vw #000;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 1.171875vw;

      .wrap-on-off-button {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.78125vw;

        > p {
          font-size: 1.09375vw;
          letter-spacing: -0.02734375vw;
          color: #fff;
        }

        .wrap-on-off-switch {
          position: relative;
          display: flex;
          gap: 0.625vw;

          .on-off-switch {
            width: 6.640625vw;
            height: 2.96875vw;
            font-size: 1.25vw;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #ddd;
            background-color: #12151d;
            border-radius: 1.015625vw;
          }

          .activeSwitch {
            background-color: #fc0000;
            color: #fff;
            font-weight: bold;
          }
        }
      }
    }

    .wrap-refresh-button,
    .wrap-logout-button {
      width: 100%;
      height: 3.90625vw;
      font-size: 1.25vw;
      letter-spacing: -0.03125vw;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1.171875vw;
      background-color: unset;
      border: none;
    }

    .wrap-logout-button {
      color: #ff0000;
      border: solid 0.078125vw #000;
    }
  }
}
</style>
