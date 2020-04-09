<template lang="pug">
#orders
  .top
    .tab-group
      .order-list-tab-buttons.tab-buttons
        .order-list-tab-button.tab-button(@click="setViewMode('a')" :class="activeAllTabBtnClass")
          | 모든 주문
          .count {{lengthOrders}}
        .order-list-tab-button.tab-button(@click="setViewMode('n')" :class="activeUnidentifiedTabBtnClass")
          | 미확인 주문
          .count {{unidentifiedOrders}}
        .order-list-tab-button.tab-button(@click="setViewMode('c')" :class="activeCheckedTabBtnClass")
          | 확인 주문
          .count {{lengthCommitedOrders}}

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
      return orders.sort((a, b) => b.timestamp - a.timestamp);
    },
    lengthOrders() {
      const { orders } = this.$store.state;
      return orders.length;
    },
    lengthCommitedOrders() {
      const { orders } = this.$store.state;
      return orders.filter((order) => order.commit).length;
    },
    unidentifiedOrders() {
      return this.lengthOrders - this.lengthCommitedOrders;
    },
    activeAllTabBtnClass(state) {
      return {
        active: state.viewMode === 'a',
      };
    },
    activeUnidentifiedTabBtnClass(state) {
      return {
        active: state.viewMode === 'n',
      };
    },
    activeCheckedTabBtnClass(state) {
      return {
        active: state.viewMode === 'c',
      };
    },
  },
  async beforeCreate() {
    console.log('bef', this.$store.state.auth.store.store_code);

    const fd = new FormData();
    fd.append('shop_code', this.$store.state.auth.store.store_code);
    await this.$store.dispatch('setOrders', fd);
  },
  methods: {
    setViewMode(value) {
      document.querySelector(".order-list").scrollTop = 0;
      this.viewMode = value;
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
    getOrderItemClass(order) {
      return {
        commit: this.checkedCommit(order),
      };
    },
    ...utils,
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
