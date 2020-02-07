<template lang="pug">
#display
  .left-side
    .p left
  .right-side
    ul.order-list()
      li.order-item(
        v-for="order in sortedOrders"
        :class="getOrderItemClass(order)"
        @click="view(order)"
        v-if="visibleOrderItem(order)"
      )
        .table-number(
          :class="getTableNumberClass(order)"
        ) {{checkedTabletNum(order)}}
        .people_total_count(v-if="visibleCustomerCount(order)") {{checkedTotalPeople(order)}}명
        .msg
          span.title(v-if="visibleCall(order)") 호출이요
          span.title(v-else-if="isDoneSetting(order)") 셋팅완료
          span.title(v-else) 주문이요
          .icon.visit(v-if="isFirstEntered(order)") 입장
          .icon.first(v-if="isFirstOrder(order)") 첫 주문
        .msg-time
          .commit(:class="getMsgTimeClass(order)") {{vaildCommitText(order)}}
          .time {{getOrderTiem(order)}}
</template>

<script>
import utils from '@utils/orders.utils';

export default {
  data () {
    return {
      viewMode: 'a',
    };
  },
  computed: {
    sortedOrders() {
      const { orders } = this.$store.state;
      console.log('orders', orders);
      return orders.sort((a, b) => b.timestamp - a.timestamp);
    },
  },
  methods: {
    getOrderItemClass(order) {
      return {
        commit: this.checkedCommit(order),
      };
    },
    view(order) {
      this.$store.dispatch('setOrder', order);
    },
    visibleOrderItem(order) {
      const commit = this.checkedCommit(order);
      return this.vaildViewMode(commit);
    },
    vaildViewMode(commit) {
      const { viewMode } = this;

      const isAll = viewMode === 'a';
      const isUndientified = viewMode === 'n' && !commit;
      const isChecked = viewMode === 'c' && commit;

      const isOk = isAll || isUndientified || isChecked;

      return isOk;
    },
    ...utils,
  },
};
</script>

<style lang="scss">
@import "../../scss/global.scss";
#display {
  display: flex;
  flex: 1;
  .left-side {
    width: 50%;
    background-color: skyblue;
  }
  .right-side {
    width: 50%;
    background-color: salmon;
    overflow-y: auto;

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
  }
  .right-side::-webkit-scrollbar {
    display: none;
  }
}

</style>
