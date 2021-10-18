<template lang="pug">
  .orders-container
    order-cash-out-standing-modal(
      v-if="getCashOutPopVisble()"
      :item="chooseOrder"
      :closeItemModal="closeMisuModal"
      :cashCommit="() => reqConfirmMisu(chooseOrder)"
    )
    p.store-name {{storeName}}{{version}}
    .header-orders-status-list
      .orders-status(@click="setViewMode('all')" :class="{activeButton: viewMode === 'all'}")
        p 모든 주문
        span {{lengthOrders}}
      .orders-status(@click="setViewMode('notConfirm')" :class="{activeButton: viewMode === 'notConfirm'}")
        p 미확인 주문
        span {{unidentifiedOrders}}
      .orders-status(@click="setViewMode('confirm')" :class="{activeButton: viewMode === 'confirm'}")
        p 확인 주문
        span {{lengthCommitedOrders}}
    .wrap-order-list
      .order-title-list
        p.order-title 테이블번호
        p.order-title 주문유형
        p.order-title 주문금액
        p.order-title 결제금액
        p.order-title 미수금
        p.order-title 선/후불
        p.order-title 결제수단
        p.order-title 주문시간
        p.order-title 총 인원수
      .wrap-order-information-lists
        .order-information-lists(v-for="(order, index) in sortedOrders" :key="`order-index-`+index")
          .order-information-list(v-if="visibleOrderItem(order)" @click="openView(order)")
            p.order-information-table-number(:class="orderStyleCheck(order)") {{checkedTabletNum(order)}}
            p.order-information-order-type(:class="orderStyleCheck(order)") {{orderTypeCheck(order)}}
            p.order-information-price {{getOrderPrice(order)}}원
            p.order-information-paid-price {{getTotalAmount(order)}}원
            p.order-information-unpaid-money(@click.stop="() => openMisuModal(order)")
              span(:class="{unpaid: getMisu(order) !== '미수금없음'}") {{ getMisu(order) }}
              span.unpaid(v-if="getVisibleWon(order)") 원 
            p.order-information-paid-type {{paidTypeCheck(order)}}
            p.order-information-credit-type {{creditTypeCheck(order)}}
            p.order-information-order-time {{getOrderTime(order).substr(11)}}
            p.order-information-total-people {{visitGroups(order)}}명
</template>

<script>
import utils from '@utils/orders.utils';
import { won } from '@utils/regularExpressions';
import { payments } from '@apis';
import { version } from '@utils/constants';

const {
  requestMisuCommit,
} = payments;
export default {
  data () {
    return {
      viewMode: 'all',
      isLoading: false,
      chooseOrder: {},
      version,
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
    storeName() {
      const { auth } = this;
      return auth && auth.store && auth.store.store_name;
    },
    auth() {
      return this.$store.state.auth;
    },
  },
  async mounted() {
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
    async reqConfirmMisu(order) {
      if (order?.order_view_key) {
        const res = await requestMisuCommit(order.order_view_key);
        if (res?.status === 200) {
          this.chooseOrder = {};
          this.$store.commit('UPDATE_DONE_MISU_ORDERS', order);
          this.$store.commit('updateAlertModalMessage', '현금 수납 처리 되었습니다.');
          this.$store.commit('updateIsAlertModal', true);
        }
      }
    },
    getCashOutPopVisble() {
      return this.chooseOrder?.totalMisu > 0;
    },
    closeMisuModal() {
      this.chooseOrder = {};
    },
    getMisuBtnActive(order) {
      return {
        active: order.totalMisu > 0,
      };
    },
    openMisuModal(order) {
      if (order.totalMisu > 0) {
        this.chooseOrder = order;
      }
    },
    getVisibleWon(order) {
      return order.totalMisu > 0;
    },
    getMisu(order) {
      try {
        if (order.totalMisu === 0) {
          throw '미수금없음';
        }
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
        return won(order.totalAmount);
      } catch (error) {
        return 0;
      }
    },
    setViewMode(value) {
      document.querySelector(".header-orders-status-list").scrollTop = 0;
      this.viewMode = value;
    },
    openView(order) {
      this.$store.dispatch('setOrder', order);
    },
    visibleOrderItem(order) {
      const commit = this.checkedCommit(order);
      return this.validViewMode(commit);
    },
    validViewMode(commit) {
      const { viewMode } = this;
      const isAll = viewMode === 'all';
      const isUndientified = viewMode === 'notConfirm' && !commit;
      const isChecked = viewMode === 'confirm' && commit;
      const isOk = isAll || isUndientified || isChecked;
      return isOk;
    },
    getOrderItemClass(order) {
      return {
        on: this.checkedCommit(order),
      };
    },
    orderTypeCheck(order) {
      const viewType = order.viewType;

      if (viewType === 0) {
        return '첫주문';
      }

      if (viewType === 1) {
        return '주문';
      }

      if (viewType === 2) {
        return '호출';
      }

      if (viewType === 3) {
        return '세팅완료';
      }

      if (viewType === 4) {
        return '평가';
      }
    },
    orderStyleCheck(order) {
      const orderType = this.orderTypeCheck(order);
      
      if (orderType === '첫주문' || orderType === '주문') {
        return 'orderColorRed';
      }

      if (orderType === '호출') {
        return 'orderColorBlue';
      }

      if (orderType === '세팅완료') {
        return 'orderColorGreen';
      }

      if (orderType === '평가') {
        return 'orderColorYellow';
      }
    },
    paidTypeCheck(order) {
      if (order.paidOrder) {
        return '선불';
      }
      
      return '후불';
    },
    creditTypeCheck(order) {
      const creditType = order.creditType;

      if (creditType === 'cash') {
        return '현금';
      }

      if (creditType === 'cart') {
        return '카드';
      }

      if (creditType === 'complex') {
        return '카드+현금';
      }
    },
    visitGroups(order) {
      return order?.visitGroups?.total ? order.visitGroups.total : 0;
    },
    ...utils,
  }
};
</script>
<style lang="scss" scoped>
.orders-container {
  font-family: 'Spoqa Han Sans Neo', 'sans-serif';
  display: flex;
  flex-direction: column;

  .store-name {
    width: 83.59375vw;
    height: 3.125vw;
    display: flex;
    font-size: 0.9375vw;
    color: #fff;
    justify-content: flex-end;
    align-items: center;
  }

  .header-orders-status-list {
    width: 83.59375vw;
    display: flex;
    align-items: center;
    gap: 0.78125vw;
    font-size: 1.5625vw;
    font-weight: bold;
    color: #ddd;

    .orders-status {
      flex: 1;
      min-height: 4.6875vw;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1.5625vw;
      background-color: #404144;
      border-top-left-radius: 0.78125vw;
      border-top-right-radius: 0.78125vw;
      letter-spacing: -0.0390625vw;

      span {
        font-size: 3.125vw;
        letter-spacing: -0.078125vw;
        color: #fff;
      }
    }

    .activeButton {
      background-color: #fff !important;
      color: #000;

      span {
        color: #000;
      }
    }
  }

  .wrap-order-list {
    flex:1;
    width: 84.53125vw;
    background-color: #fff;
    padding: 0 1.5625vw !important;
    box-sizing: border-box;

    .order-title-list {
      display: grid;
      grid-template-columns: 1fr 5.46875vw 7.8125vw 7.8125vw 7.8125vw 3.90625vw 6.25vw 5.859375vw 4.53125vw;
      gap: 2.34375vw;
      padding: 3.75vh 1.5625vw 1.25vh !important;
      border-bottom: solid 0.078125vw #333333;
      box-sizing: border-box;
      

      .order-title {
        font-size: 1.09375vw;
        color: #666;
        text-align: center;
      }
    }
    .wrap-order-information-lists {
      height: calc(92.5vh - 7.8125vw);
      overflow: auto;
      .order-information-lists {
        .order-information-list {
          height: 4.375vw;
          padding: 0 1.5625vw !important;
          display: grid;
          grid-template-columns: 1fr 5.46875vw 7.8125vw 7.8125vw 7.8125vw 3.90625vw 6.25vw 5.859375vw 4.53125vw;
          align-items: center;
          gap: 2.34375vw;
          box-sizing: border-box;

          > p {
            font-size: 1.406250vw;
            letter-spacing: -0.02109375vw;
            text-align: center;
          }

          .orderColorRed {
            color: #fc0000;
          }
          .orderColorBlue {
            color: #184fe1;
          }
          .orderColorGreen {
            color: #1e9d2f;
          }
          .orderColorYellow {
            color: #e5a11a;
          }

          .order-information-table-number {
            font-weight: bold;
          }

          .order-information-unpaid-money {
            color: #999;
            .unpaid {
              color: #fc0000;
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
}

</style>