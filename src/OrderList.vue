<template lang="pug">
#orders
  order-detail(v-bind:orders="orders" v-bind:auth="auth")
  #order-list
    .top
      .order-list-tab-buttons.tab-buttons
        .order-list-tab-button.tab-button(v-on:click="setViewMode('a')" :class="{active: viewMode=='a'}")
          | 모든 주문 보기
          .count {{orders.length}}
        .order-list-tab-button.tab-button(v-on:click="setViewMode('n')" :class="{active: viewMode=='n'}")
          | 미확인 주문 보기
          .count {{orders.length - commited_orders_count}}
        .order-list-tab-button.tab-button(v-on:click="setViewMode('c')" :class="{active: viewMode=='c'}")
          | 확인 주문 보기
          .count {{commited_orders_count}}
      .tab-group
        .tab-name 서비스
        .tab-buttons
          .tab-button(:class="{active:serviceStatus}" v-on:click="setServiceStatus(1)") 켜기
          .tab-button(:class="{active:!serviceStatus}" v-on:click="setServiceStatus(0)") 끄기
      .tab-group
        .tab-name 주문
        .tab-buttons
          .tab-button(:class="{active:orderStatus}" v-on:click="setOrderStatus(1)") 켜기
          .tab-button(:class="{active:!orderStatus}" v-on:click="setOrderStatus(0)") 끄기
    ul.order-list(:class="{'scroll-stop': !scroll}")
      li.order-item.order-title(v-for="order in reverse_orders" :class="{commit: order.commit.time, 'call-staff': order.call_staff, 'first-order': order.first_order}" v-on:click="newOrder(order)" :id="order.code" v-if="viewMode=='a'||viewMode=='n'&&!order.commit.time||viewMode=='c'&&order.commit.time")
        //.store_name {{order.store.name}}
        .table-number {{order.table.name}}
        .msg
          span.title(v-if="order.products[0].code=='99999'") 호출이요
          span.title(v-else-if="order.group.seq==1") 첫 주문이요
          span.title(v-else) 주문이요
        .commit {{order.commit.time ? '확인' : '미확인'}}
        .time {{order.time | moment("A hh:mm:ss") }}
</template>
<script>
import axios from 'axios';

export default {
  props: ['auth', 'orders'],
  data () {
    return {
      scroll: true,
      eventListener: null,
      viewMode: 'a',
      serviceStatus: 1,
      orderStatus: 1,
    }
  },
  computed: {
    reverse_orders() {
      return this.orders.sort(function(a,b){
        return b.time - a.time;
			})
    },
    commited_orders_count() {
      let count = 0;
      for (let order of this.orders) {
        if (order.commit.time) {
          count += 1;
        }
      } 
      return count;
    }
  },
  methods: {
    setServiceStatus(value) {
      this.serviceStatus = value;
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

    },
    setOrderStatus(value) {
      this.orderStatus = value;
      let url = 'http://admin.torder.co.kr/store/shop_open_order';
      if (!this.orderStatus) {
        url = 'http://admin.torder.co.kr/store/shop_close_order';
      }
      let fd = new FormData();
      fd.append('store_code', this.auth.store.code);
      axios
      .post(url, fd)
      .then(function(res) {
        console.log(res);
      });
    },
    setViewMode(value) {
      this.viewMode = value;
    },
    setOrders(orders) {
      this.orders = orders;
    },
    newOrder(order) {
      this.scroll = false;
      this.$eventBus.$emit('newOrder', order); 
    },
    closeOrder(order) {
      this.scroll = true;
    },
  },
  beforeCreate() {
  },
  created() {
    let auth = this.auth;
    if (auth && auth.store) {
    } else {
      this.$router.push('/store');
    }
    this.$eventBus.$off('closeOrder');
    this.$eventBus.$on('closeOrder', this.closeOrder); 
    //this.$eventBus.$on('setOrders', this.setOrders); 

    //this.getOrders();

    /*
    this.eventListener = null;
    this.eventListener = new EventSource('http://view.torder.co.kr/psync.php?shop_code='+this.auth.store.code);
    this.eventListener.addEventListener('message', this.message, false);
    */
  },
  beforeDestroy() {
    /*
    this.eventListener.removeEventListener('message', this.message);
    this.eventListener.close();
    */
  }
}
</script>
<style lang="scss">
@import "./scss/global.scss";
#orders {
  width:100%;
}
#order-list {
  display:flex;
  flex-direction:column;
  width:100%;

  .top {
    display:flex;
    font-size:20px;
  }

  .tab-group {
    display:flex;
    flex-grow:1;
  }
  .tab-name { 
    display:flex;
    align-items: center;
    justify-content: center;
  }
  .tab-buttons {
    flex-grow:1;
    display:flex;
    padding:0;
    margin:24px;
    background-color:#000000;
    border-radius:100px;

    .tab-button {
      display:flex;
      height:60px;
      flex-grow:1;
      align-items: center;
      justify-content: center;
      font-weight:900;
      background-color:#000000;
      color:#ffffff;

      .count {
        margin-left:8px;
        display:flex;
        align-items: center;
        justify-content: center;
        height:28px;
        padding:0 4px;
        background-color:#ffffff;
        color:#000000;
        border-radius:100px;
        font-size:20px;
      }
    }
    .tab-button:first-child {
      border-top-left-radius: 100px;
      border-bottom-left-radius: 100px;
    }
    .tab-button:last-child {
      border-top-right-radius: 100px;
      border-bottom-right-radius: 100px;
    }
    .tab-button.active {
      background-color:#fafafa;
      color:#000000;
      border-radius:100px;

      .count {
      background-color:#000000;
      color:#fafafa;
      }
    }
  }

  .scroll-stop {
    overflow:hidden !important;
    -webkit-overflow-scrolling: auto !important; 
  }
  > .order-list {
    display:flex;
    flex-direction:column;
    flex-grow:1;
    margin:0;
    padding:0 24px;

    overflow:auto;
    -webkit-overflow-scrolling: touch; 

    .order-item {
      @include order-title;
      padding:12px 0;
      border: {
        bottom:solid 1px #808080;
        top:solid 1px #808080;
      }
    }
    .order-item.commit {
      opacity:0.5;
    }
  }
}

</style>
