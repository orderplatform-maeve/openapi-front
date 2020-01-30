<template lang="pug">
  #orderview
    modal-confirm(
      v-bind:show="confirmModal.show"
      v-bind:close="confirmModal.close"
      v-bind:title="confirmModal.title"
      v-bind:message="confirmModal.message"
    )
    modal-table-orders
    modal-order(v-if="order")
    .body
      .left
        router-view(
          v-bind:orders="orders"
          v-bind:auth="auth"
          v-bind:time="time"
          v-bind:stores="stores"
        )
      .right
        .top
          .button(v-on:click="restart('/')") 새로고침
          .datetime
            span {{time.now | moment("MM.DD HH:mm") }}
          img.logo(src="https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/logo/torder_color_white.png")
          .store_name {{auth && auth.store && auth.store.name}}
          router-link.button(v-if="auth && auth.store && auth.store.code" to="/order") 주문 보기
          router-link.button(v-if="auth && auth.store && auth.store.code" to="/table") 테이블 보기<br/>(테스트)
        .bottom
          hr
          .tab-group
            .tab-name 태블릿 화면
            .tab-buttons
              .tab-button(:class="{active:!store.serviceStatus}" @click="openTabletScreen") On
              .tab-button(:class="{active:store.serviceStatus}" @click="closeTabletScreen") Off
          .tab-group
            .tab-name 태블릿 주문
            .tab-buttons
              .tab-button(:class="{active:!store.orderStatus}" @click="agreeOrder()") On
              .tab-button(:class="{active:store.orderStatus}" @click="rejectOrder()") Off
          hr
          router-link.button(v-if="stores.length > 1" to="/store") 매장 보기
          router-link.button.button-red(v-if="!auth.member.name" to="/login") 로그인
          .button.button-red.button-member(v-if="auth.member.name" @click="logout")
            span.name {{auth && auth.member && auth.member.name}}
            span 로그아웃
    .foot.foot-left
</template>

<script>
import { mapActions } from 'vuex';

import store from '@store/store';
import { isEmpty } from '@utils/CheckedType';

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
    };
  },

  computed: {
    order() {
      return Boolean(this.$store.getters.order);
    },
    stores() {
      return this.$store.getters.stores;
    },
    store() {
      return this.$store.getters.store;
    },
    auth() {
      return this.$store.getters.auth;
    },
  },

  /**
  * TODO:
  * - 절차 적으로 실행되게 수정 필요
  */
  created() {
    this.initialized();
  },

  mounted() {
    this.time.now = Date();
  },

  methods: {
    ...mapActions([
      'setOpenTablet',
      'setCloseTablet',
      'setAgreeOrder',
      'setRejectOrder',
      'setAuth',
      'logout',
    ]),
    async initialized() {
      const auth = this.$cookies.get('auth') || {};
      const noData = isEmpty(auth);

      if (noData) {
        return;
      }

      if (auth) {
        const response = await this.setAuth(auth);

        if (response) {
          this.getStores();
          this.socketEmitter();
        }

      }
    },
    getStores() {
      if(!(this.auth.member && this.auth.member.code)) {
        return;
      }

      const params = {
        member_code: this.auth.member.code,
      };

      this.$store.dispatch('setStores', params);
    },
    socketEmitter() {
      if (this.auth && this.auth.store && this.auth.store.code) {
        const reqData = { store_code: this.auth.store.code };
        this.orders = [];

        console.log('reqData', reqData);

        this.$socket.emit('reqStoreInfo', reqData);
        this.$socket.emit('reqTablesInfo', reqData);
        this.$socket.emit('reqPos', reqData);
        this.$socket.emit('reqCategorys', reqData);
        this.$socket.emit('reqProducts', reqData);
        this.$socket.emit('reqClients', reqData);
        this.$socket.emit('reqRestartClients', reqData);
      }
    },
    logout() {
      this.$store.dispatch('logout');
      this.$cookies.remove('auth', null, null);
      this.$router.replace('/login');
    },
    restart(url) {
      if (!url) {
        url = '/';
      }
      window.location = url;
    },
    closeConfirmModal() {
      this.confirmModal.show = false;
    },
    async reqOpenTablet() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.code);

      const response = await this.setOpenTablet(fd);

      if (response) {
        this.store.serviceStatus = 0;
      }
    },
    async reqCloseTablet() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.code);

      const response = await this.setCloseTablet(fd);

      if (response) {
        this.store.serviceStatus = 1;
      }
    },
    async reqAgreeOrder() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.code);

      const response = await this.setAgreeOrder(fd);

      if (response) {
        this.store.serviceStatus = 0;
      }
    },
    async reqRejectOrder() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.code);

      const response = await this.setRejectOrder(fd);

      if (response) {
        this.store.serviceStatus = 1;
      }
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
