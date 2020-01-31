<template lang="pug">
#orders
  .top
    .tab-group
      .order-list-tab-buttons.tab-buttons
        .order-list-tab-button.tab-button(@click="setViewMode('a')" :class="{active: isActiveAllOrderBadge}")
          | 모든 주문
          .count {{lengthOrders}}
        .order-list-tab-button.tab-button(@click="setViewMode('n')" :class="{active: isUnidentifiedOrdersBadge}")
          | 미확인 주문
          .count {{unidentifiedOrders}}
        .order-list-tab-button.tab-button(@click="setViewMode('c')" :class="{active: isCheckedOrdersBadge}")
          | 확인 주문
          .count {{lengthCommitedOrders}}

  ul.order-list()
    li.order-item(
      v-for="order in sortedOrders"
      :class="{commit: order.commit}"
      @click="view(order)"
      v-if="vaildViewMode(order.commit)"
    )
      .table-number(
        :class="getTableNumberClass(order)"
      ) {{order.T_order_order_tablet_number}}
      .people_total_count(v-if="visibleCustomerCount(order.total_peoples)") {{order.total_peoples}}명
      .msg
        span.title(v-if="visibleCall(order)") 호출이요
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
  props: {
    auth: {
      type: Object,
      default() {
        return {
          member: {},
          store: {},
        };
      },
    },
    orders: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data () {
    return {
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
    unidentifiedOrders() {
      return this.lengthOrders - this.lengthCommitedOrders;
    },
    isActiveAllOrderBadge(state) {
      return state.viewMode === 'a';
    },
    isUnidentifiedOrdersBadge(state) {
      return state.viewMode === 'n';
    },
    isCheckedOrdersBadge(state) {
      return state.viewMode === 'c';
    },
  },
  methods: {
    setViewMode(value) {
      document.querySelector(".order-list").scrollTop = 0;
      this.viewMode = value;
    },
    view(order) {
      this.$store.dispatch('setOrder', order);
    },
    vaildViewMode(commit) {
      const { viewMode } = this;

      const isAll = viewMode === 'a';
      const isUndientified = viewMode === 'n' && !commit;
      const isChecked = viewMode === 'c' && commit;

      const isOk = isAll || isUndientified || isChecked;

      return isOk;
    },
    getTableNumberClass(order) {
      const goodCode = this.vaildGoodCode(order);
      return this.getGoodType(goodCode);
    },
    vaildGoodCode(order) {
      const isOrderInfo = order && order.order_info;
      const isEmptyOrderInfo = order.order_info.length > 0;
      const itemCode = isOrderInfo && isEmptyOrderInfo && order.order_info[0].good_code;

      return itemCode;
    },
    getGoodType(goodCode) {
      const call = goodCode === '99999';
      const setting = goodCode === '88888';

      const result = {
        call,
        setting,
      };

      return result;
    },
    visibleCustomerCount(cnt) {
      return cnt > 0;
    },
    visibleCall(order) {
      const { call } = this.getTableNumberClass(order);

      return call;
    }
  }
};
</script>

<style lang="scss">
@import "../../scss/global.scss";
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
