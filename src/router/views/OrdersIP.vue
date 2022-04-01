<template lang="pug">
  .wrap-orders-container
    //- 주문보기 내에서만 보여야하는게 아닌, 발레파킹 페이지에서도 보여져야해서 수정되었음. (Layout.vue)
    //- auction-modal(v-if="order && auction")
    //- modal-order(v-if="order && !auction")
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
      .wrap-order-list
        .electronic-access-list-version
          p.order-title 테이블번호
          p.order-title 주문시간
          p.order-title 주문IP
          p.order-title 에러메세지
        .wrap-order-information-lists-electronic
          div(v-for="(order, index) in sortedOrders" :key="`order-index-`+index" :class="getOrderListStyle(index)")
            .order-information-list(v-if="visibleOrderItem(order)")
              p.order-information-table-number(:class="orderStyleCheck(order)") {{checkedTabletNum(order)}}
              p.order-information-order-time {{getOrderTime(order).substr(11)}}
              p.order-ip-information
                span {{orderIp(order)}}
              p.order-error-message-information
                span {{errorMessage(order)}}

</template>

<script>
import utils from '@utils/orders.utils';
import { won } from '@utils/regularExpressions';
import { payments } from '@apis';
import { version } from '@utils/constants';
import { checkBoxActive, checkBoxDisable  } from '@svg';

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
      onlyEvent: false,
    };
  },
  components: {
    checkBoxActive,
    checkBoxDisable,
  },
  computed: {
    order() {
      return !!this.$store.state.order;
    },
    auction() {
      return this.$store.state.auction;
    },
    sortedOrders() {
      const { orders } = this.$store.state;
      console.log(orders, 'orders 확인');
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
    payloadStatus() {
      return this.$store.state.payloadStatus;
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

    const payloadStatus = localStorage.getItem('payloadStatus');

    if (payloadStatus) {
      this.$store.commit('setPayloadStatus', parseInt(payloadStatus));
    }
  },
  methods: {
    getOrderListStyle(index) {
      return {
        'order-information-lists': true,
        'bg-gray': index % 2 === 0,
      };
    },
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
      if (order.viewType === 5) {
        this.$store.commit('auctionFlag', true);
      } else {
        this.$store.commit('auctionFlag', false);
      }
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
      if (viewType === 5) {
        return '경매';
      }
      if (viewType === 6) {
        return '게임';
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
        return 'orderColorOrange';
      }

      if (orderType === '평가') {
        return 'orderColorYellow';
      }
      if (orderType === '경매' || orderType === '게임') {
        return 'orderColorGreen';
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
    orderIp(order) {
      return order?.requestIP || '';
    },
    errorMessage(order) {
      return order?.errorMsg || '';
    },
    ...utils,

    payloadInfoChange(number) {
      this.$store.commit('setPayloadStatus', number);
      localStorage.setItem('payloadStatus', number);
    },
    totalVisitPeopleDeepDepth(order) {
      const visitPeopleGroup = order?.visitGroups?.groupInfo;

      if (visitPeopleGroup) {
        let text = '';

        try {
          text += `${Object.keys(visitPeopleGroup)[0]} ${visitPeopleGroup[Object.keys(visitPeopleGroup)[0]]}명, `;
          text += `${Object.keys(visitPeopleGroup)[1]} ${visitPeopleGroup[Object.keys(visitPeopleGroup)[1]]}명`;

          return text;
        } catch {
          return false;
        }
      }
    },
    electronicAccessPeople(order) {
      const people = order?.visitPeopleCnt;
      return people ? people : 0;
    },
    filterEventDisable() {
      this.onlyEvent = false;
      const fd = new FormData();
      fd.append('shop_code', this.$store.state.auth.store.store_code);
      this.$store.dispatch('setOrders', fd);
    },
    filterEventActive() {
      this.onlyEvent = true;
      const { orders } = this.$store.state;
      // viewType 5: 경매, 6: 게임
      let eventList = orders.filter( order => order.viewType >= 5);
      this.$store.commit('filterEvent', eventList);
    },
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
      flex: 0.33;
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

    // 결제미포함 버전
    .electronic-access-list-version {
      display: grid;
      grid-template-columns: 15.625vw 7vw 9.375vw 1fr;
      gap: 3.90625vw;
      padding: 3.75vh 1.5625vw 1.25vh !important;
      border-bottom: solid 0.078125vw #333333;
      box-sizing: border-box;

      .order-title {
        font-size: 1.09375vw;
        color: #666;
        text-align: center;
      }
    }

    .wrap-order-information-lists-electronic {
      height: 92.5vh;
      overflow: auto;
      .order-information-lists {
        .order-information-list {
          height: 4.375vw;
          padding: 0 1.5625vw !important;
          display: grid;
          grid-template-columns: 15.625vw 7vw 9.375vw 1fr;
          align-items: center;
          gap: 3.90625vw;
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

          .orderColorOrange {
            color: #FF7A00;
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

          .order-ip-information {
            height: 2.65625vw;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 0.78125vw;
            border-radius: 0.390625vw;
          }

          .order-error-message-information {
            display: flex;
            justify-content: center;
            align-items: center;

            > span {
              height: 2.65625vw;
              font-weight: bold;
              border-radius: 0.390625vw;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        }
      }

      .bg-gray {
        background-color: #f5f5f5;
      }

      .confirm-status {
        background-color: #343434 !important;

        .order-ip-information {
          .red-box {
            background-color: #fff !important;
            color: #000 !important;
          }
        }

        .order-information-list {
          > p {
            color: #fff !important;
          }
        }

        .order-error-message-information {
          > span {
            background-color: #fff !important;
            color: #000 !important;
          }
        }
      }
    }
  }
}

</style>