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
      .right
        .top
          .button(v-on:click="restart()") 새로고침
          .datetime
            span {{ time.now | moment("MM.DD HH:mm") }}
          img.logo(:src="logo")
          .store_name {{storeName}}
          //- router-link.button(v-if="visibleOrderButton" :to="paths.order") 주문 보기
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
          .version 1.0.3
          .button.button-red.button-member(v-if="visibleLogoutButton" @click="logout")
            span.name {{userName}}
            span 로그아웃
    .foot.foot-left
</template>

<script>
import store from '@store/store';
import paths from '@router/paths';
import { COOKIE_AUTH_NAME } from '@config';

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
      logo: 'https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/logo/torder_color_white.png'
    };
  },

  computed: {
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
  },

  mounted() {
    this.time.now = Date();
  },

  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$cookies.remove(COOKIE_AUTH_NAME, null, null);
      this.$router.replace(paths.login);
    },
    restart() {
      this.$router.go(0);
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
  },
};
</script>

<style lang="scss">
@import "../../scss/global.scss";
#orderview {
  display:flex;
  flex-direction:column;
  width:100vw;
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
    .button {
      display:flex;
      align-items: center;
      justify-content: center;
      margin-top:12px;
      height:40px;
      width:100%;
      border-radius:100px;
      background-color:#ffffff;
      color:#000000;
      font-weight:900;
      text-decoration:none;
      .name {
        font-size:12px;
      }
      text-align:center;
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
    right:0;
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
