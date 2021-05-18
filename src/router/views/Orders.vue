<template lang="pug">
#orders
  .top_menu.fixed
    .menu(@click="setViewMode('a')" :class="activeAllTabBtnClass")
      | 모든 주문
      span {{lengthOrders}}
    .menu(@click="setViewMode('n')" :class="activeUnidentifiedTabBtnClass")
      | 미확인 주문
      span {{unidentifiedOrders}}
    .menu(@click="setViewMode('c')" :class="activeCheckedTabBtnClass")
      | 확인주문
      span {{lengthCommitedOrders}}
  .hide-menu-back
  .list_box.mt
    ul.order_list
      li.order-item(
        v-for="order in sortedOrders"
        v-if="visibleOrderItem(order)"
      )
        a(@click="view(order)")
          .tn(:class="getOrderTypeColor(order)") {{checkedTabletNum(order)}}
          .txt1
            template(v-if="order.viewType==0") 첫주문
            template(v-if="order.viewType==1") 주문
            template(v-if="order.viewType==2") 호출
            template(v-if="order.viewType==3") 세팅완료
            template(v-if="order.viewType==4") 평가
          //- .check(v-bind:class="getOrderItemClass(order)") 확인
          .order-price {{ getOrderPrice(order) }}
            span 원
          .paid-price {{ getTotalAmount(order) }}
            span 원
          .misu-btn {{ getMisu(order) }}
            span 원
          .txt2
            template(v-if="order.paidOrder") 선불
            template(v-else) 후불
          div(v-bind:class="{txt4: order.creditStat==false, txt3:order.creditStat==true || order.paidOrder==false}")
            template(v-if="order.creditType=='cash'") 현금
            template(v-if="order.creditType=='card'") 카드
            template(v-if="order.creditType=='complex'") 카드+현금
            template(v-if="order.paidOrder==false") &nbsp;&nbsp;&nbsp;&nbsp;
          .date {{ getOrderTime(order).substr(11) }}
          .btn_orderList 주문내역
</template>

<script>
import utils from '@utils/orders.utils';
import { won } from '@utils/regularExpressions';

export default {
  data () {
    return {
      viewMode: 'a',
      isLoading: false,
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
  async mounted() {
    console.log(this.sortedOrders);
    this.isLoading = true;

    const fd = new FormData();
    fd.append('shop_code', this.$store.state.auth.store.store_code);
    const res = await this.$store.dispatch('setOrders', fd);
    // console.log(res);

    if (res) {
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    }
  },
  methods: {
    getMisu(order) {
      try {
        console.log(order.totalMisu);
        return won(order.totalMisu);
      } catch (error) {
        return '미수금없음';
      }
    },
    getOrderTypeColor(order) {
      try {
        const result = {
          bg_red: order.viewType === 1 || order.viewType === 0,
          bg_blue: order.viewType === 2,
          bg_green: order.viewType === 3,
          bg_yellow: order.viewType === 4,
          'overflow-hidden': true,
        };
        return result;
      } catch (error) {
        return '';
      }
    },
    getOrderPrice(order) {
      try {
        return won(order.orderPrice);
      } catch (error) {
        return 0;
      }
    },
    getTotalAmount(order) {
      try {
        return won(order.totalMisu);
      } catch (error) {
        return 0;
      }
    },
    setViewMode(value) {
      document.querySelector(".order_list").scrollTop = 0;
      this.viewMode = value;
    },
    view(order) {
      this.$store.dispatch('setOrder', order);
    },
    visibleOrderItem(order) {
      const commit = this.checkedCommit(order);
      return this.validViewMode(commit);
    },
    validViewMode(commit) {
      const { viewMode } = this;

      const isAll = viewMode === 'a';
      const isUndientified = viewMode === 'n' && !commit;
      const isChecked = viewMode === 'c' && commit;

      const isOk = isAll || isUndientified || isChecked;

      return isOk;
    },
    getOrderItemClass(order) {
      return {
        on: this.checkedCommit(order),
      };
    },
    ...utils,
  }
};
</script>

<style lang="scss">
@import "../../scss/global.scss";

.overflow-hidden {
  overflow: hidden;
}

.fixed {
  position: fixed;
  z-index: 2;
  width: calc(100% - 180px) !important;
  box-sizing: border-box;
  top: 16px;
  left: 16px;
}

.mt {
  margin-top: 72px !important;
  height: calc(100% - 72px) !important;
}

.hide-menu-back {
  width: calc(100% - 150px);
  height: 72px;
  position: fixed;
  left: 0;
  top: 0;
  background-color: #1C1B21;
  z-index: 1;
}

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
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    font-size: 40px;
    font-weight: 900;
  }
}
</style>
