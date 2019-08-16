<template lang="pug">
  #orderview
    modal-confirm
    .body
      .left
        router-view(v-bind:orders="orders" v-bind:auth="auth" v-bind:time="time" v-bind:stores="stores")
      .right
        .top
          .button(v-on:click="restart('/')") 새로고침
          .datetime {{time.now | moment("MM월DD일 HH시mm분") }}
          img.logo(src="https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/logo/torder_color_white.png")
          .store_name(v-on:click="removeAuth") {{store.name}}
          router-link.button(v-if="store.code" to="/order") 주문 보기

        .bottom
          .button(v-if="!flag_restarting_clients" v-on:click="restartClients()") 타블렛 새로고침
          .button.active(v-if="flag_restarting_clients" ) 타블렛 새로고침 중
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
    //.foot.foot-left
      //router-link.button(v-if="isSelectedStore()" to="/table") 테이블 보기

</template>
<script>
import axios from 'axios';

export default {
  data () {
    return {
      auth: {},
      stores: [],
      store: {},
      orders: [],
      time: {
        now: 0,
        start: 0,
        end: 0,
      },
      flag_restarting_clients: 0,
    }
  },
  sockets: {
    connect: function () {
      this.$socket.emit('in', {});
      this.$socket.emit('whoAmI');
      console.log('socket connected');
    },
    resStoreInfo(data) {
      console.log('resStoreInfo', data);
      this.store = data;
    },
    resOrders: function(data) {
      console.log('resOrders', data);
      console.table(data.items);
      //console.table(data);
      if (data.time) {
        this.time.start = data.time.start;
        this.time.end = data.time.end;
      }
      if (data.items) {
        this.orders = data.items; 
      }
      //this.$eventBus.$emit('setOrders',data); 
    },
    resCommitOrder: function(data) {
      console.log('resCommitOrder', data);
      if (data && data.code && data.commit && data.commit.time) {
        for (let order of this.orders) {
          if (order.code == data.code) {
            order.commit.time = data.commit.time;
            break;
          } 
        }
      }
    },
    resRestartClients: function(data) {
      console.log('resRestartClients', data);
      alert(data.count + '대의 태블렛에 새로고침을 요청 했습니다.');
      this.flag_restarting_clients = 0;
    },
    orderview: function(data) {
      //console.log('orderview', data);
      if (this.auth && this.auth.store && this.auth.store.code) {
        if (this.auth.store.code != data.store.code) {
          return
        }
      } else {
        return 
      }
      this.orders.push(data);
      this.$eventBus.$emit('newOrder',data); 
    },
    youAre: function(data) {
      console.log('youAre', data, data.store_code); 

      if(data.store_code) {
        if (!this.auth.store) {
          console.log('set store_code', data.store_code);
          this.auth.store = {
            name: '',
            code: data.store_code,
          } 
          console.log(this.auth.store);
        }
        this.reqOrders();
        this.$router.push({
          name: 'order',
        });
      }
    },
    restart: function(url) {
      this.restart(url);
    },
  },
  computed: {
    isMember() {
      if (this.auth && this.auth.member) {
        return true;
      }
    },
  },
  methods: {
    restartClients() {
      if(this.auth.store && this.auth.store.code) {
      } else {
        return;
      }
      let reqData = {store_code: this.auth.store.code};
      this.flag_restarting_clients = 1;
      console.log('reqRestartClients', reqData);
      this.$socket.emit('reqRestartClients', reqData);
    },
    setServiceStatus(value) {
      if (value) { 
        this.$eventBus.$emit('openConfirmModal', {
          title: '태블릿 열기',
          message: '모든 태블릿의 화면을 열어요',
          confirm: function() {
            let url = 'http://admin.torder.co.kr/store/shop_open';
            let fd = new FormData();
            fd.append('store_code', this.auth.store.code);
            axios
            .post(url, fd)
            .then(function(res) {
              console.log(res);
              this.$eventBus.$emit('closeConfirmModal');
              this.store.serviceStatus = value;
            });
          }.bind(this),
        }); 
      } else {
        this.$eventBus.$emit('openConfirmModal', {
          title: '태블릿 닫기',
          message: '모든 태블릿의 화면을 닫아요',
          confirm: function() {
            let url = 'http://admin.torder.co.kr/store/shop_close';
            let fd = new FormData();
            fd.append('store_code', this.auth.store.code);
            axios
            .post(url, fd)
            .then(function(res) {
              console.log(res);
              this.$eventBus.$emit('closeConfirmModal');
              this.store.serviceStatus = value;
            });
          }.bind(this),
        }); 
      }

      /*
      let url = 'http://admin.torder.co.kr/store/shop_open';
      if (!this.serviceStatus) {
        url = 'http://admin.torder.co.kr/store/shop_close';
      }
      let fd = new FormData();
      fd.append('store_code', this.auth.store.code);
      axios
      .post(url, fd)
      .then(function(res) {
        console.log(res);
      });
      */
    },
    setOrderStatus(value) {
      if (!value) { 
        this.$eventBus.$emit('openConfirmModal', {
          title: '주문 받기',
          message: '태블릿에서 주문을 받아요',
          confirm: function() {
            let url = 'http://admin.torder.co.kr/store/shop_close_order';
            let fd = new FormData();
            fd.append('store_code', this.auth.store.code);
            axios
            .post(url, fd)
            .then(function(res) {
              console.log(res);
              this.$eventBus.$emit('closeConfirmModal');
              this.store.orderStatus = value;
            });
          }.bind(this),
        }); 
      } else {
        this.$eventBus.$emit('openConfirmModal', {
          title: '주문 중단',
          message: '태블릿을 메뉴판으로만 사용하고 주문은 안돼요',
          confirm: function() {
            let url = 'http://admin.torder.co.kr/store/shop_close_order';
            let fd = new FormData();
            fd.append('store_code', this.auth.store.code);
            axios
            .post(url, fd)
            .then(function(res) {
              console.log(res);
              this.$eventBus.$emit('closeConfirmModal');
              this.store.orderStatus = value;
            });

          }.bind(this),
        }); 
      }
      /*
      */
    },
    restart(url) {
      if (!url) {
        url = '/';
      }
      window.location = url;
    },
    reqOrders() {
      console.log('!!try reqOrders');
      this.orders = []; 
      if (this.auth && this.auth.store && this.auth.store.code) {
        let reqData = {store_code: this.auth.store.code};
        console.log('reqOrders', reqData);
        this.$socket.emit('reqStoreInfo', reqData);
        this.$socket.emit('reqOrders', reqData);
      }
    },
    setStoreLength(length) {
    },
    loadAuth() {
      let auth = {};
      try { 
        auth = this.$cookies.get('auth');
      } catch(e) {
      }
      if (!auth) {
        auth = {};
      }
      this.auth = auth;
    },
    saveAuth() {
      let auth = this.auth;
      console.log('saveAuth', auth);
      this.$cookies.set('auth',  auth, '1y', null, null);
    },
    removeAuth() {
      if (confirm('매장을 떠나시겠습니까?')) {
        this.auth = {};
        this.$cookies.remove("auth", null, null);
        this.restart('/');
      }
    },
    logout() {
      this.stores = [];
      this.auth.member = undefined
      this.saveAuth();
      //this.$router.push({name: 'member'});
    },
    isSelectedStore() {
      if (this.auth && this.auth.store) {
        return true;
      }
    },
    pushOrder(order) {
    },
  },
  beforeCreate() {
    /*
    this.sockets.subscribe('orderview', (data) => {
      //this.msg = data.message;
      console.log('orderview', data);
      //this.$eventBus.$emit('newOrder',data); 
        
    });
    */
  },
  created() {
    setInterval(function(){
      this.time.now = Date();
    }.bind(this), 1000);

    this.loadAuth();
    this.$eventBus.$on('logout', this.logout);
    this.$eventBus.$on('saveAuth', this.saveAuth); 
    this.$eventBus.$on('removeAuth', this.removeAuth); 
    this.$eventBus.$on('reqOrders', this.reqOrders);

    if (this.auth && this.auth.store && this.auth.store.code) {
      this.$eventBus.$emit('reqOrders'); 
      this.$router.push({name: 'order'});
    } else {
      this.$router.push({name: 'member'});
    }
  },
  beforeDestroy() {
    //this.sockets.unsubscribe('orderview');
  },
}
</script>
<style lang="scss">
@import "./scss/global.scss";
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
    width:200px;
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
        font-size:16px;
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
        font-size:16px;
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
