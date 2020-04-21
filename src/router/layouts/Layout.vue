<template lang="pug">
  #orderview
    modal-confirm(
      :show="confirmModal.show"
      :close="confirmModal.close"
      :title="confirmModal.title"
      :message="confirmModal.message"
      :confirm="confirmModal.confirm"
    )
    modal-order(v-if="order")
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
            span {{ time.now | moment("MM.DD HH:mm:ss") }}
          img.logo(:src="logo")
          .store_name {{storeName}}
          router-link.button(v-if="visibleOrderButton" :to="paths.order") 주문 보기
          router-link.button(v-if="visibleOrderButton" :to="paths.products") 상품 관리
            <br> (테스트)
          //- router-link.button(v-if="visibleOrderButton" :to="paths.tables") 테이블 보기
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
import { COOKIE_AUTH_NAME } from '@config';
import { COOKIE_DOMAIN } from '@config/auth.constant';
import { version } from '@utils/constants';

export default {
  store,
  data() {
    return {
      orders: [],
      time: {
        now: 0,
        start: 0,
        end: 0,
      },
      confirmModal: {
        show: false,
        close: () => {},
        title: '',
        message: '',
      },
      paths,
      logo: 'https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/logo/torder_color_white.png',
      version,
    };
  },
  computed: {
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
      // console.log(auth);
      return auth && auth.member && auth.member.name;
    },
    visibleLoginButton() {
      return !this.userName;
    },
    visibleLogoutButton() {
      return !!this.userName;
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
      console.log(e);
    }

    this.$store.commit('updateMACAddr', MACAddr);
  },
  created() {
    this.getAuthentication();
  },
  mounted() {
    this.getUCode();
    this.loopBeep();
    if (process.env.UPLOAD_TYPE !== 'tmp') {
      this.tagetVersionRedirect();
    }
  },
  sockets: {
    connect() {
      console.log('connect sokets');
      this.beep();
    },
    orderview(message) {
      this.$socket.emit('res', message, (msg) => {
        console.log('socket res');
      });
    }
  },
  methods: {
    async tagetVersionRedirect() {
      try {
        if (this.$store.state.auth?.store?.store_code) {
          const params = new FormData();
          params.append('store_code', this.$store.state.auth.store.store_code);
          const res = await this.$store.dispatch('setStoreInit', params);

          // console.log('tagetVersionRedirect', res);

          if (res.data.data.T_order_store_orderView_version) {
            const {
              protocol,
              hostname,
              pathname,
              port,
            } = location;

            const nowPath = `${protocol}//${hostname}${pathname}`;

            // console.log('location', nowPath);

            if (process.env.STOP_REDIRECT) {
              const nowDevPath = `${protocol}//${hostname}:${port}${pathname}`;
              // console.log('location dev', nowDevPath === 'http://localhost:8080/');

              if (nowDevPath !== 'http://localhost:8080/') {
                return location.replace('/');
              }
            } else {
              if (nowPath !== res.data.data.T_order_store_orderView_version) {
                return location.replace(res.data.data.T_order_store_orderView_version);
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
      this.$cookies.remove(COOKIE_AUTH_NAME, null, COOKIE_DOMAIN);
      localStorage.removeItem('auth');
      this.$router.replace(paths.login);
    },
    restart() {
      // location.href = '/'; // cache 파일을 먼저 로드한다.
      location.replace('/'); // cache 파일을 로드하지 않는다.
    },
    openTabletScreen() {
      this.confirmModal.show = true;
      this.confirmModal.close = this.closeConfirmModal;
      this.confirmModal.title = '태블릿 열기';
      this.confirmModal.message = '모든 태블릿의 화면을 열어요';
      this.confirmModal.confirm = this.reqOpenTablet;
    },
    closeTabletScreen() {
      this.confirmModal.show = true;
      this.confirmModal.close = this.closeConfirmModal;
      this.confirmModal.title = '태블릿 닫기';
      this.confirmModal.message = '모든 태블릿의 화면을 닫아요';
      this.confirmModal.confirm = this.reqCloseTablet;
    },
    agreeOrder() {
      this.confirmModal.show = true;
      this.confirmModal.close = this.closeConfirmModal;
      this.confirmModal.title = '주문 받기';
      this.confirmModal.message = '태블릿에서 주문을 받아요';
      this.confirmModal.confirm = this.reqAgreeOrder;
    },
    rejectOrder() {
      this.confirmModal.show = true;
      this.confirmModal.close = this.closeConfirmModal;
      this.confirmModal.title = '주문 중단';
      this.confirmModal.message = '태블릿을 메뉴판으로만 사용하고 주문은 안돼요';
      this.confirmModal.confirm = this.reqRejectOrder;
    },
    closeConfirmModal() {
      this.confirmModal.show = false;
    },
    async reqOpenTablet() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.store_code);

      const response = await this.$store.dispatch('setOpenTablet', fd);

      if (response) {
        this.device.serviceStatus = 0;
        this.closeConfirmModal();
      }
    },
    async reqCloseTablet() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.store_code);

      const response = await this.$store.dispatch('setCloseTablet', fd);

      if (response) {
        this.device.serviceStatus = 1;
        this.closeConfirmModal();
      }
    },
    async reqAgreeOrder() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.store_code);
      const response = await this.$store.dispatch('setAgreeOrder', fd);

      if (response) {
        this.device.orderStatus = 0;
        this.closeConfirmModal();
      }
    },
    async reqRejectOrder() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.store_code);
      const response = await this.$store.dispatch('setRejectOrder', fd);

      if (response) {
        this.device.orderStatus = 1;
        this.closeConfirmModal();
      }
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
      const datetime = this.$moment(time).format();

      let deviceUsage = {};
      try {
        if (window.UUID) {
          deviceUsage = JSON.parse(window.UUID.getDeviceUsage());
        }
      } catch(e) {
        //console.log(e);
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

      this.$socket.emit('event', data, (answer) => {
        // console.log('event', answer.msg);
      });
    },
    getAuthentication() {
      console.log('getAuthentication', this.$cookies.get('auth'));

      const params = { store_code: this.auth.store.store_code };
      this.$socket.emit('reqStoreInfo', params);

      const cookieAuth = this.$cookies.get(COOKIE_AUTH_NAME);
      if (cookieAuth) {
        localStorage.auth = JSON.stringify(cookieAuth);

        try {
          const fd = new FormData();
          fd.append('store_code', cookieAuth.store.store_code);
          this.$store.dispatch('setStoreInit', fd);
        } catch (error) {
          console.log(error);
        }
        this.$store.commit('SET_AUTH', cookieAuth);
      }

      if (localStorage.auth) {
        this.$cookies.set(COOKIE_AUTH_NAME, localStorage.auth, '1y', null, COOKIE_DOMAIN);

        try {
          const fd = new FormData();
          fd.append('store_code', JSON.parse(localStorage.auth).store.store_code);
          this.$store.dispatch('setStoreInit', fd);
        } catch (error) {
          console.log(error);
        }

        this.$store.commit('SET_AUTH', JSON.parse(localStorage.auth));
      }
    },
    getUCode() {
      // get uCode from localStorage
      let uCode = localStorage.getItem('uCode');

      // get uCode from cookie
      if (!uCode) {
        uCode = this.$cookies.get('uCode');
      }

      // create uCode if no code
      if (!uCode) {
        uCode = '';
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < 5; i++ ) {
          uCode += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        this.$cookies.set("uCode", uCode, "3y");
      }

      // set uCode to localStorage
      localStorage.setItem('uCode', uCode);
      this.$store.commit('updateUCode', uCode);
    },
    loopBeep() {
      this.beep();
      setInterval(() => {
        this.time.now = Date();

        const timestemp = parseInt(Date.now() / 1000);
        const lap = timestemp % 30;
        const term = lap < 1;

        if (term) {
          this.beep();
        }
      }, 1000);
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
  display:flex;
  flex-direction:row;
  padding:12px;
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
</style>
