<template lang="pug">
  #orderview
    .body
      router-view(v-bind:orders="orders" v-bind:auth="auth")
    .foot-right
      router-link.button.button-red(v-if="auth.member" to="/logout") {{auth.member.name}} 로그아웃
      router-link.button.button-red(v-if="!auth.member" to="/member") 로그인 
      router-link.button(v-if="storesLength>1" to="/store") 매장 보기
      //router-link.button(v-if="isSelectedStore()" to="/table") 테이블 보기
      router-link.button(v-if="isStore" to="/order") 주문 보기
    .foot-left
      .button(v-on:click="restart") 재시작

</template>
<script>
import axios from 'axios';

export default {
  data () {
    return {
      auth: {},
      orders: [],
      storesLength: 0,
    }
  },
  sockets: {
    connect: function () {
      this.$socket.emit('in', {});
      this.$socket.emit('whoAmI');
      console.log('socket connected');
    },
    resOrders: function(data) {
      console.log('resOrders', data);
      this.orders = data; 
      //this.$eventBus.$emit('setOrders',data); 
    },
    resCommit: function(data) {
      console.log('resCommitOrder', data);
    },
    orderview: function(data) {
      console.log('orderview', data);
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
    restart: function() {
      this.restart();
    },
  },
  computed: {
    isMember() {
      if (this.auth && this.auth.member) {
        return true;
      }
    },
    isStore() {
      if (this.auth && this.auth.store && this.auth.store.code) {
        return true;
      }
    },
  },
  methods: {
    restart() {
      window.location.reload();
    },
    reqOrders() {
      console.log('!!try reqOrders');
      this.orders = []; 
      if (this.auth && this.auth.store && this.auth.store.code) {
        let reqData = {store_code: this.auth.store.code};
        console.log('reqOrders', reqData);
        this.$socket.emit('reqOrders', reqData);
      }
    },
    setStoreLength(length) {
      this.storesLength = length;
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
      this.$cookies.remove("auth", null, null);
      this.auth = {};
    },
    logout() {
      this.auth.member = undefined
      this.saveAuth();
      this.$router.push({name: 'member'});
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
    this.loadAuth();
    this.$eventBus.$on('logout', this.logout);
    this.$eventBus.$on('saveAuth', this.saveAuth); 
    this.$eventBus.$on('removeAuth', this.removeAuth); 
    this.$eventBus.$on('setStoreLength', this.setStoreLength);
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
#orderview {
  display:flex;
  flex-direction:column;
  width:90vw;
  height:90vh;
  position:relative;
  background-color:#242424;
  font-family: 'NanumSquare', sans-serif;
}
#orderview > .body {
  display:flex;
  flex-grow:1;
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
        margin:-12px;

      .button {
        margin:12px;
        display:flex;
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
    > .body {
      padding:24px 0;
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
    position:absolute;
    bottom:0;
    right:0;
  }
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
  }
  .button-red {
    background-color:#ff0000;
    color:#ffffff;
  }
}

</style>
