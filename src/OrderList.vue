<template lang="pug">
#orders
  .top
    .tab-group
      .order-list-tab-buttons.tab-buttons
        .tab-button.datetime {{time.start | moment("MM월DD일 HH시mm분") }} 부터
        .order-list-tab-button.tab-button(v-on:click="setViewMode('a')" :class="{active: viewMode=='a'}")
          | 모든 주문 보기
          .count {{orders.length}}
        .order-list-tab-button.tab-button(v-on:click="setViewMode('n')" :class="{active: viewMode=='n'}")
          | 미확인 주문 보기
          .count {{orders.length - commited_orders_count}}
        .order-list-tab-button.tab-button(v-on:click="setViewMode('c')" :class="{active: viewMode=='c'}")
          | 확인 주문 보기
          .count {{commited_orders_count}}
  ul.order-list(:class="{'scroll-stop': !scroll}")
    li.no-item(v-if="orders.length<1") 아직 주문이 없어요<br/>ㅠㅠ
    li.order-item.order-title(v-for="order in orders" :class="{commit: order.commit.time, 'call-staff': order.call_staff, 'first-order': order.first_order}" v-on:click="newOrder(order)" :id="order.code" v-if="viewMode=='a'||viewMode=='n'&&!order.commit.time||viewMode=='c'&&order.commit.time")
      //.store_name {{order.store.name}}
      .table-number {{order.table.name}}
      .msg
        span.title(v-if="order.products[0].code=='99999'") 호출이요
        span.title(v-else-if="order.products[0].code=='88888'") 셋팅완료
        span.title(v-else) 주문이요
      .visit(v-if="order.products[0].code!='88888'&&order.group.seq==1") 입장
      .first(v-if="order.first") 첫 주문
      .commit(:class="{commited:order.commit.time}") {{order.commit.time ? '확인' : '미확인'}}
      .time {{order.time | moment("A hh:mm:ss") }}
</template>
<script>
import axios from 'axios';

export default {
  props: ['auth', 'orders', 'time'],
  data () {
    return {
      scroll: true,
      eventListener: null,
      viewMode: 'a',
    }
  },
  computed: {
    reverse_orders() {
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
    setViewMode(value) {
      document.querySelector(".order-list").scrollTop = 0;
      this.viewMode = value;
    },
    newOrder(order) {
      console.log('method newOrder');
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
  display:flex;
  flex-direction:column;
  width:100%;

  .top {
    display:flex;
    flex-shrink:0;
    height:40px;
    padding:12px;
    font-size:16px;

    @include tab-group;

    .tab-button.datetime {
      font-weight:400!important;
    }
  }
  .order-list {
    display:flex;
    flex-direction: column;
    margin:0;
    padding:0 12px;
    overflow:scroll;
    flex-grow:1;
    -webkit-overflow-scrolling: touch; 
    /*transform: rotate(180deg);*/

    .no-item {
      display:flex;
      align-items: center;
      justify-content: center;
      flex-grow:1;
      font-size:32px;
      font-weight:400;
      text-align:center;
    }
    .order-item {
      @include order-title;
      padding:8px 0;
      flex: 0 0 auto;
      border: {
        top:solid 1px #484848;
      }
      /*transform: rotate(-180deg);*/
    }
    .order-item:first-child {
      border-top:none;
    }
    .order-item.commit {
      opacity:0.5;
    }
  }
  .scroll-stop {
    overflow:hidden !important;
    -webkit-overflow-scrolling: auto !important; 
  }
}

</style>
