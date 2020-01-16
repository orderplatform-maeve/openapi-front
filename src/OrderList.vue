<template lang="pug">
#orders
  .top
    .tab-group
      .order-list-tab-buttons.tab-buttons
        .order-list-tab-button.tab-button(v-on:click="setViewMode('a')" :class="{active: viewMode=='a'}")
          | 모든 주문
          .count {{lengthOrders}}
        .order-list-tab-button.tab-button(v-on:click="setViewMode('n')" :class="{active: viewMode=='n'}")
          | 미확인 주문
          .count {{lengthOrders - lengthCommitedOrders}}
        .order-list-tab-button.tab-button(v-on:click="setViewMode('c')" :class="{active: viewMode=='c'}")
          | 확인 주문
          .count {{lengthCommitedOrders}}

  ul.order-list()
    li.order-item(v-for="order in sortedOrders" :class="{commit: order.commit}" v-on:click="view(order)" v-if="viewMode=='a'||viewMode=='n'&&!order.commit||viewMode=='c'&&order.commit" )
      .table-number(:class="{call: order.order_info[0].good_code=='99999', setting: order.order_info[0].good_code=='88888'}") {{order.T_order_order_tablet_number}}
      .people_total_count(v-if="order.total_peoples > 0") {{order.total_peoples}}명
      .msg
        span.title(v-if="order.order_info[0].good_code=='99999'") 호출이요
        span.title(v-else-if="order.order_info[0].good_code=='88888'") 셋팅완료
        span.title(v-else) 주문이요
        .icon.visit(v-if="order.is_tablet_first_order") 입장
        .icon.first(v-if="order.is_first_order") 첫 주문
      .msg-time
        .commit(:class="{commited:order.commit}") {{order.commit ? '확인' : '미확인'}}
        .time {{order.order_time}}
</template>
<script>

  export default {
    props: ['auth', 'orders', 'time'],
    data () {
      return {
        scroll: true,
        eventListener: null,
        viewMode: 'a',
      };
    },
    computed: {
      sortedOrders() {
        return this.$store.getters.sortedOrders;
      },
      lengthOrders() {
        return this.$store.getters.lengthOrders;
      },
      lengthCommitedOrders() {
        return this.$store.getters.lengthCommitedOrders;
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
    },
    methods: {
      setViewMode(value) {
        document.querySelector(".order-list").scrollTop = 0;
        this.viewMode = value;
      },
      view(order) {
        this.$store.dispatch('setOrder', order);
      },
      newOrder(order) {
        console.log('method newOrder');
        this.scroll = false;
        this.$eventBus.$emit('newOrder', order);
      },
      closeOrder(order) {
        this.scroll = true;
      },
    }
  };
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
