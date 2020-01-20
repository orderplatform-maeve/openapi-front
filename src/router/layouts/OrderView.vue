<template lang="pug">
  #orderview
    menu-board
    modal-confirm
    modal-table-orders
    order-detail(v-bind:orders="orders" v-bind:auth="auth")
    .body
      .left
        router-view(v-bind:orders="orders" v-bind:auth="auth" v-bind:time="time" v-bind:stores="stores")
      .right
        .top
          .button(v-on:click="restart('/')") 새로고침
          .datetime
            span {{time.now | moment("MM.DD HH:mm") }}
          img.logo(src="https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/logo/torder_color_white.png")
          .store_name(v-on:click="removeAuth") {{store.name}}
          router-link.button(v-if="store.code" to="/order") 주문 보기
          router-link.button(v-if="store.code" to="/table") 테이블 보기<br/>(테스트)
        .bottom
          hr
          .tab-group
            .tab-name 태블릿 화면
            .tab-buttons
              .tab-button(:class="{active:!store.serviceStatus}" v-on:click="setServiceStatus(0)") On
              .tab-button(:class="{active:store.serviceStatus}" v-on:click="setServiceStatus(1)") Off
          .tab-group
            .tab-name 태블릿 주문
            .tab-buttons
              .tab-button(:class="{active:!store.orderStatus}" v-on:click="setOrderStatus(0)") On
              .tab-button(:class="{active:store.orderStatus}" v-on:click="setOrderStatus(1)") Off
          hr
          router-link.button(v-if="stores.length>1" to="/store") 매장 보기
          router-link.button.button-red(v-if="!auth.member" to="/member") 로그인
          .button.button-red.button-member(v-if="auth.member" v-on:click="logout")
            span.name {{auth.member.name}}
            span 로그아웃
    .foot.foot-left
</template>

<script>
import { store } from '@store/store';

export default {
  data() {
    return {
      auth: {},
      // stores: [], // 매장 목록들
      store: {}, // RLB 가게 정보
      orders: [],
      flag_restarting_clients: 0,
      time: {
        now: 0,
        start: 0,
        end: 0,
      },
    };
  },
  store,

  computed: {
    stores() {
      return this.$store.getters.stores;
    },
  },

  created() {
    this.time.now = Date();
    this.loadAuth();
    this.setStores();
  },

  mounted() {
    this.initStore();
  },

  methods: {
    loadAuth() {
      let auth = {};
      try {
        // %7B%22store%22%3A%7B%22code%22%3A%22AA221111%22%2C%22name%22%3A%22%EC%B2%AD%EB%8B%B4%EC%9D%B4%EC%83%81(%EA%B5%AC%EB%A1%9C%EB%94%94%EC%A7%80%ED%84%B8%EC%A0%90)%22%2C%22amt%22%3Anull%2C%22cnt%22%3A1%7D%2C%22member%22%3A%7B%22code%22%3A%22torder%22%2C%22name%22%3A%22%ED%8B%B0%EC%98%A4%EB%8D%94(%EB%A7%88%EC%8A%A4%ED%84%B0)%22%7D%7D
        auth = this.$cookies.get('auth');
        console.log('auth', auth);
      } catch(e) {
        console.log(e);
      }
      if (!auth) {
        auth = {};
      }
      this.auth = auth;


      this.$store.dispatch('setAuth', auth);
    },
    initStore() {
      if (this.auth && this.auth.store && this.auth.store.code) {
        let reqData = {store_code: this.auth.store.code};
        this.orders = [];

        console.log('init store');

        this.$socket.emit('reqStoreInfo', reqData);
      }
    },
    setStores() {
      if(!(this.auth.member && this.auth.member.code)) {
        return;
      }
      let params = {
        member_code: this.auth.member.code,
      };

      this.$store.dispatch('setStores', params);
    },
    removeAuth() {

    },
    logout() {

    },
  },

  sockets: {
    connect: () => {
      console.log('socket connected');
    },
    resStoreInfo(data) {
      console.log('resStoreInfo', data);
      this.store = data;
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
