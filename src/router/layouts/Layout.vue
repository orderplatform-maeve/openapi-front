<template lang="pug">
#orderview
  modal-all-refresh(
    :show="visibleAllRefreshModal"
    :close="onCloseAllRefreshModal"
    :data="allRefreshList"
  )
  flash-message
  modal-confirm(
    :show="confirmModal.show"
    :close="confirmModal.close"
    :title="confirmModal.title"
    :message="confirmModal.message"
    :confirm="confirmModal.confirm"
  )
  modal-order(v-if="order")
  //- transition(name="signboard")
  //-   .top(v-if="isDisConnectNetwork")
  //-     .alert {{ signboardMessage }}
  .body
    .left
      router-view(
        :auth="auth"
        :orders="orders"
        :stores="stores"
        :time="time"
      )
    .right(v-if="visibleSideMenu()")
      .top
        .button(
          @click="restart()"
        ) 새로고침
        .datetime
          span {{ getNowDate() }}
        torder
        .store_name {{storeName}}
        router-link.button(v-if="visibleOrderButton" :to="paths.order") 주문 보기
        router-link.button(v-if="visibleOrderButton" :to="paths.additional") 추가 기능
          <br> (테스트)

        //- router-link.button(v-if="visibleOrderButton" :to="paths.products") 상품 관리
        //-   <br> (테스트)
        //- router-link.button(v-if="visibleOrderButton" :to="paths.tables") 테이블 주문
        //-   <br> (테스트)
        //- router-link.button(v-if="visibleOrderButton" :to="paths.pickUpTables") 픽업 요청
        //-   <br> (테스트)
      //-   router-link.button(v-if="visibleOrderButton" :to="paths.updateCategories") 분류 관리
      //-     <br> (테스트)
      .bottom
        hr
        .tab-group
          .tab-name 태블릿 화면
          .tab-buttons
            .tab-button(:class="getOnTabletMonitorClass(device)" @click="openTabletScreen") On
            .tab-button(:class="getOffTabletMonitorClass(device)" @click="closeTabletScreen") Off
        .tab-group
          .tab-name 태블릿 주문
          .tab-buttons
            .tab-button(:class="getOnTabletOrderClass(device)" @click="agreeOrder") On
            .tab-button(:class="getOffTabletOrderClass(device)" @click="rejectOrder") Off
        .tab-group
          .tab-name 주문 내역
          .tab-buttons
            .tab-button(:class="getOnTabletRecentOrderClass(device)" @click="showRecentOrder") On
            .tab-button(:class="getOffTabletRecentOrderClass(device)" @click="hideRecentOrder") Off
        hr
        router-link.button(v-if="visibleStoresButton" :to="paths.store") 매장 보기
        router-link.button.button-red(v-if="visibleLoginButton" :to="paths.login") 로그인
        .name {{userName}}
        .version {{version}}
        .button.button-red.button-member(v-if="visibleLogoutButton" @click="logout")
          span 로그아웃
  .foot.foot-right
    .version-footer u-code: {{uCode}} {{version}}
</template>

<script>
import store from '@store/store';
import paths from '@router/paths';
import { version } from '@utils/constants';
import { Torder } from '@svg';

export default {
  components: {
    Torder,
  },
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
    };
  },
  computed: {
    confirmModal() {
      return this.$store.state.confirmModal;
    },
    uCode() {
      return this.$store.state.uCode;
    },
    order() {
      return !!this.$store.state.order;
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
    },
  },
  methods: {
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
            type: '@reqeust/ordering/location/table',
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
        await this.$store.dispatch('setTables', params);

      } catch (error) {
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

            if (!process.env.STOP_REDIRECT) {
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
    getOnTabletMonitorClass(device) {
      const active = !this.vaildServiceStatus(device);

      return {
        active,
      };
    },
    getOffTabletMonitorClass(device) {
      const active = this.vaildServiceStatus(device);

      return {
        active,
      };
    },
    vaildServiceStatus(device) {
      return device && device.serviceStatus;
    },
    getOnTabletOrderClass(device) {
      const active = !this.vaildOrderStatus(device);

      return {
        active,
      };
    },
    getOffTabletOrderClass(device) {
      const active = this.vaildOrderStatus(device);

      return {
        active,
      };
    },
    vaildOrderStatus(device) {
      return device && device.orderStatus;
    },
    beep() {
      const time = Date.now();
      const ISONow = new Date(time).toISOString();
      const datetime = this.$moment(ISONow).format();

      let deviceUsage = {};
      try {
        if (window.UUID) {
          deviceUsage = JSON.parse(window.UUID.getDeviceUsage());
        }
      } catch(e) {
        //// console.log(e);
      }

      const data = {
        type: 'beep',
        uCode: this.$store.state.uCode,
        MACAddr: this.$store.state.MACAddr,
        deviceUsage: deviceUsage,
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
    getAuthentication() {
      try {
        const params = { store_code: this.auth.store.store_code };

        const auth = JSON.parse(localStorage.auth);
        console.log('getAuthentication', auth);

        this.$socket.emit('reqStoreInfo', params);
        this.$store.commit('SET_AUTH', auth);
      } catch (error) {
        // console.log(error);
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
          // // console.log('term', new Date());
          this.beep();
        }
      }, 1000);
    },
    onCloseAllRefreshModal() {
      this.$store.commit('CLOSE_ALL_REFRES_MODAL');
      this.$store.commit('SET_ALL_REFRESH_LIST', []);
    },
    getOnTabletRecentOrderClass(device) {
      const active = !this.vaildRecentOrderStatus(device);

      return {
        active,
      };
    },
    getOffTabletRecentOrderClass(device) {
      const active = this.vaildRecentOrderStatus(device);

      return {
        active,
      };
    },
    vaildRecentOrderStatus(device) {
      return device && device.recentOrderStatus;
    },
    getNowDate() {
      if (!this.time.now) {
        return '';
      }
      const now = new Date(this.time.now);
      const ISONow = now.toISOString();

      return this.$moment(ISONow).format('MM.DD HH:mm:ss');
    },
  },
};
</script>

<style lang="scss">
@import "../../scss/global.scss";
#orderview {
  display:flex;
  flex-direction:column;
  width: 100vw;
  height: 100vh;
  position:relative;
  background-color:#000000;
  font-family: 'NanumSquare', sans-serif;
}
#orderview > .top {
  display: flex;
  flex-direction: row;
  .alert {
    background-color: #ff0000;
    font-size: 28px;
    padding: 12px;
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
  }
}
#orderview > .body {
  display:flex;
  flex-grow:1;
  overflow:scroll;

  .right {
    width:120px;
    flex-shrink:0;
    flex-direction:column;
    display:flex;
    padding:12px;
    overflow:auto;
    background-color:#121212;

    hr {
      border-color:#606060;
    }

    .name {
      font-size:12px;
      text-align: center;
      margin-bottom: 4px;
    }

    .button {
      display:flex;
      align-items: center;
      justify-content: center;
      margin-top: 8px;
      margin-bottom: 4px;
      height: 40px;
      width: 100%;
      border-radius: 100px;
      background-color: #ffffff;
      color: #000000;
      font-weight: 900;
      text-decoration: none;
      text-align: center;
    }
    .button.active {
      background-color:#484848;
      color:#eaeaea;
    }
    .button-member {
      flex-direction:column;
    }
    .button-red {
      background-color:#ff0000;
      color:#ffffff;
    }
    .top {
      display:flex;
      flex-direction:column;
      align-items: center;
      justify-content: flex-start;
      flex-grow:1;
      .logo {
        height:40px;
        margin-bottom:12px;
        max-width:160px;
      }
      .button{
        margin-top:0!important;
        margin-bottom:12px;
      }
      .store_name {
        margin-bottom:12px;
        font-size:12px;
        font-weight:900;
        word-break:keep-all;
        text-align:center;
      }
      .datetime {
        margin-bottom:12px;
        display:flex;
        flex-direction:column;
        align-items: center;
        justify-content: center;
        width:100%;
        height:40px;
        border-radius:100px;
        background-color:#484848;
        font-weight:400;

        .price {
          font-size:12px;
          font-weight:900;
        }
      }
    }
    .bottom{
      justify-content: flex-end;

      .buttons {
        display:flex;
      }
    }
    .version {
      text-align: center;
    }

    @include tab-group;

    .tab-group {
      flex-direction:column;
      margin-top:0px;
      flex-grow:0;
      .tab-name {
        display:flex;
        height:40px;
        padding:0 24px;
        font-size:12px;
        font-weight:900;
        border-radius:200px;
        background-color:#121212;
        color:#ffffff;
        align-items: center;
        justify-content: center;
        text-decoration:none;
      }
    }
    > .button {
      display:flex;
      margin-top:40px;
      height:40px;
      padding:0 24px;
      font-size:16px;
      font-weight:900;
      border-radius:200px;
      background-color:#eaeaea;
      color:#000000;
      align-items: center;
      justify-content: center;
      text-decoration:none;
      box-shadow: 0px 0px 12px -4px #000000;
    }

  }
  .left {
    flex-grow:1;
    display:flex;
    overflow:auto;
    .container {
      display:flex;
      flex-direction:column;
      padding:12px;
      flex-grow:1;

      > * {
        display:flex;
      }
      > .top {

        display:flex;
        align-items: center;
        justify-content: center;
        border-bottom:solid 1px #ffffff;
        padding-bottom:12px;
        .title {
          display:flex;
          align-items: center;
          justify-content: center;
          font-size:24px;
          font-weight:900;
        }
      }
      > .bottom {
        margin-top:24px;

        .button {
          display:flex;
          margin:0;
          flex-grow:1;
          align-items: center;
          justify-content: center;
          height:60px;
          background-color:#ff0000;
          color:#ffffff;
          border-radius:100px;
          font-size:20px;
          font-weight:900;
        }
      }
    }
  }
}
#orderview {
  > .foot-left {
    display:flex;
    position:absolute;
    bottom:0;
    left:0;
  }
  > .foot-right {
    display:flex;
    position:fixed;
    bottom:0;
    right: 4px;
    .version-footer {
      font-size: 8px;
    }
  }
  > .foot {
    .button {
      display:flex;
      margin: 12px 6px;
      height:40px;
      padding:0 24px;
      font-size:16px;
      font-weight:900;
      border-radius:200px;
      background-color:#eaeaea;
      color:#000000;
      align-items: center;
      justify-content: center;
      text-decoration:none;
      box-shadow: 0px 0px 12px -4px #000000;
    }
  }
}

@keyframes mdHead {
  0% {
    transform: translateY(-100vh);
  }
  100% {
    transform: translateY(0);
  }
}

.signboard-enter-active {
  animation: mdHead .5s;
}

.signboard-leave-active {
  animation: mdHead .5s reverse;
}
</style>
