<template lang="pug">
.wrap-orders-container
  //- 주문보기 내에서만 보여야하는게 아닌, 발레파킹 페이지에서도 보여져야해서 수정되었음. (Layout.vue)
  //- auction-modal(v-if="order && auction")
  //- modal-order(v-if="order && orderModal")
  //- PosErrorModal(v-if="order && posResponseMessage")
  .orders-container
    order-cash-out-standing-modal(
      v-if="getCashOutPopVisble()"
      :item="chooseOrder"
      :closeItemModal="closeMisuModal"
      :cashCommit="() => reqConfirmMisu(chooseOrder)"
      :standardPriceUnit="standardPriceUnit"
      :standardPriceFrontPosition="standardPriceFrontPosition"
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
    .wrap-payload-info-status-select
      .payload-wrap
        p.payload-info(:class="{'payload-active': payloadStatus === 1}" @click="payloadInfoChange(1)") 결제미포함
        p.payload-info(:class="{'payload-active': payloadStatus === 0}" @click="payloadInfoChange(0)") 결제포함
      .event-filter
        div(v-if="onlyEvent" @click="filterEventDisable()")
          check-box-active
        div(v-if="!onlyEvent" @click="filterEventActive()")
          check-box-disable
        p.event-text 이벤트 주문 내역만 보기
    .wrap-order-list(v-if="payloadStatus === 0")
      div(:class="getOrderTitleListStyle()")
        p.order-title 테이블번호
        p.order-title 주문유형
        p.order-title 주문금액
        p.order-title 결제금액
        p.order-title(v-if="!isTorderTwo && !isRemakePaid") 미수금
        p.order-title 선/후불
        p.order-title 결제방식
        p.order-title 주문시간
        p.order-title 총 인원수
      .wrap-order-information-lists
        div(v-for="(order, index) in sortedOrders" :key="`order-index-`+index" :class="getOrderListStyle(order, index)")
          div(:class="getOrderInformationListStyle()" v-if="visibleOrderItem(order)" @click="openView(order)")
            p.order-information-table-number(:class="orderStyleCheck(order)") {{checkedTabletNum(order)}}
            p.order-information-order-type(:class="getOrderTypeStyle(order)") {{orderTypeCheck(order)}}
            p.order-information-price
              span(v-if="standardPriceFrontPosition") {{standardPriceUnit}}
              span {{getOrderPrice(order)}}
              span(v-if="!standardPriceFrontPosition") {{standardPriceUnit}}
            p.order-information-paid-price
              span(v-if="standardPriceFrontPosition") {{standardPriceUnit}}
              span {{getTotalAmount(order)}}
              span(v-if="!standardPriceFrontPosition") {{standardPriceUnit}}
            p.order-information-unpaid-money(v-if="!isTorderTwo && !isRemakePaid" @click.stop="() => openMisuModal(order)")
              span(:class="{unpaid: getMisu(order) !== '미수금없음'}")
                span(v-if="getVisibleWon(order) && standardPriceFrontPosition") {{standardPriceUnit}}
                span {{ getMisu(order) }}
                span(v-if="getVisibleWon(order) && !standardPriceFrontPosition") {{standardPriceUnit}}
            p.order-information-paid-type {{paidTypeCheck(order)}}
            p.order-information-credit-type {{creditTypeCheck(order)}}
            p.order-information-order-time {{getOrderTime(order).substr(11)}}
            p.order-information-total-people {{visitGroups(order)}}명
    .wrap-order-list(v-if="payloadStatus === 1")
      .electronic-access-list-version
        p.order-title 주문유형
        p.order-title 테이블번호
        p.order-title 주문내역
        p.order-title 주문시간
        p.order-title 총 인원수
      .wrap-order-information-lists-electronic
        div(v-for="(order, index) in sortedOrders" :key="`order-index-`+index" :class="getOrderListStyle(order, index)")
          .order-information-list(v-if="visibleOrderItem(order)" @click="openView(order)")
            p.order-information-order-type(:class="getOrderTypeStyle(order)") {{orderTypeCheck(order)}}
            p.order-information-table-number(:class="orderStyleCheck(order)") {{checkedTabletNum(order)}}
            p.order-information-goods-name {{getGoodsName(order)}}
            p.order-information-order-time {{getOrderTime(order).substr(11)}}
            .order-information-people-group
              p.wrap-small-text
                span.small-text {{totalVisitPeopleDeepDepth(order)}}
                span.small-text(v-if="totalVisitPeopleDeepDepth(order)")  =
              span.red-box {{visitGroups(order)}}명

</template>

<script>
import utils from '@utils/orders.utils';
import { won } from '@utils/regularExpressions';
import { credit } from '@apis';
import { version } from '@utils/constants';
import { checkBoxActive, checkBoxDisable  } from '@svg';
import { PosErrorModal } from '@components';

const { requestCashAllCommit } = credit;
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
    PosErrorModal
  },
  computed: {
    order() {
      return !!this.$store.state.order;
    },
    auction() {
      return this.$store.state.auction;
    },
    posResponseMessage() {
      return this.$store.state.posResponseMessage;
    },
    orderModal() {
      return this.$store.state.orderModal;
    },
    sortedOrders() {
      const { orders } = this.$store.state;
      return orders.sort((a, b) => b.timestamp - a.timestamp);
    },
    lengthOrders() {
      const { orders } = this.$store.state;
      return orders?.length;
    },
    lengthCommitedOrders() {
      const { orders } = this.$store.state;
      return orders.filter((order) => order.commit)?.length;
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
    standardPriceUnit() {
      const standardPriceUnit = this.$store.state.standardPriceUnit;
      return standardPriceUnit;
    },
    standardPriceFrontPosition() {
      const standardPriceFrontPosition = this.$store.state.standardPriceFrontPosition;
      return standardPriceFrontPosition;
    },
    isTorderTwo() {
      return this.$store.state.isTorderTwo;
    },
    isRemakePaid() {
      return this.$store.state.isRemakePaid;
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
    this.AndroidPostData();
  },
  methods: {
    getOrderListStyle(order, index) {
      return {
        'order-information-lists': true,
        'confirm-status': order.commit,
        'bg-black': index % 2 === 0,
      };
    },
    async reqConfirmMisu(order) {
      if (order?.order_view_key) {
        const res = await requestCashAllCommit(order.order_view_key);
        if (res?.status === 200) {
          this.chooseOrder = {};
          this.$store.commit('UPDATE_DONE_MISU_ORDERS', order);
          this.$store.commit('updateAlertModalMessage', '현금 수납 처리 되었습니다.');
          this.$store.commit('updateIsAlertModal', true);
        } else {
          this.$store.commit('pushFlashMessage', '현금 수납 확인에 실패했습니다. 티오더로 문의 바랍니다.');
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
        const isNotTotalMisu = order.totalMisu === 0 || order.totalMisu === undefined;
        if (isNotTotalMisu) {
          return '미수금없음';
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
        const isNotPrice = order.orderPrice === undefined;

        if (isNotPrice) {
          return 0;
        }
        return won(order.orderPrice);
      } catch (error) {
        return 0;
      }
    },
    getTotalAmount(order) {
      try {
        const isNotTotalPrice = order.totalAmount === undefined;

        if (isNotTotalPrice) {
          return 0;
        }
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
        this.$store.commit('orderModalFlag', true);
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
    getOrderTypeStyle(order) {
      const orderType = this.orderTypeCheck(order);

      if (orderType === '호출') {
        return 'orderFontColorBlue';
      }

      if (orderType === '세팅완료') {
        return 'orderFontColorOrange';
      }

      if (orderType === '평가') {
        return 'orderFontColorYellow';
      }
      if (orderType === '경매' || orderType === '게임') {
        return 'orderFontColorGreen';
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

      if (creditType === 'card') {
        return '카드';
      }

      if (creditType === 'complex') {
        return '카드+현금';
      }

      // remake 선결제(성빈님 스펙)
      if (creditType === 'V2_CARD') {
        return '카드';
      }

      if (creditType === 'V2_CASH') {
        return '현금';
      }

      if (creditType === 'V2_BY_PRICE') {
        return '더치페이';
      }

      if (creditType === 'V2_BY_MENU') {
        return '메뉴별결제';
      }
    },
    visitGroups(order) {
      return order?.visitGroups?.total ? order.visitGroups.total : 0;
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
    // 안드로이드로 init data 전송
    async AndroidPostData() {
      try {

        const params = new FormData();
        params.append('store_code', this.auth.store.store_code);

        const res = await this.$store.dispatch('setStoreInit', params);

        if (!this.isTorderTwo) {
          // 안드로이드 인터페이스 config 전송 (API 1.0)
          window.UUID.writeFile(JSON.stringify(res.data.data), '/torder/json/config.json');

        } else {
          // 안드로이드 인터페이스 config 전송 (API 2.0)
          const data = {
            storeCode: this.$store.state.auth.store.store_code,
            storeName: res.data.data.T_order_store_name,
            businessNumber: res.data.data.saupNumber,
            paymentInfo: {
              usePayment: Boolean(res.data.data.preCreditTableUse),
              vanType: res.data.data.vanInfo,
              vanDeviceId: res.data.data.storeVanTid,
              vanSerialNumber: res.data.data.storeSerialNumber,
            },
            language: res.data.data.T_order_store_language,
            baseUrl: res.data.data.T_order_store_orderView_version,
          };

          window.UUID?.initStoreInfo(data);
        }


      } catch (error) {
        console.log('안드로이드에서 실행하지 않아서 발생', error);
      }
    },
    getGoodsName(order) {
      const goodsList = order.order_info ?? [];
      const isOverOneGoodsList = goodsList.length > 1;
      const firstGoodsName = goodsList[0]?.display_name;
      const isUndefinedName = firstGoodsName === undefined;

      if (isUndefinedName) {
        return '';
      }

      if (isOverOneGoodsList) {
        const minusOneGoodsQuantity = goodsList?.length - 1 ?? 0;
        const goodsListName = `${firstGoodsName} 외 ${minusOneGoodsQuantity}개`;

        return goodsListName;
      }

      return firstGoodsName;
    },
    getOrderTitleListStyle() {
      return {
        'order-title-list': true,
        'remake-paid': this.isTorderTwo || this.isRemakePaid
      };
    },
    getOrderInformationListStyle() {
      return {
        'order-information-list': true,
        'remake-paid': this.isTorderTwo || this.isRemakePaid
      };
    }
  },
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
      background-color: #111 !important;
      color: #fff;

      span {
        color: #fff;
      }
    }
  }

  .wrap-payload-info-status-select {
    height: 3.90625vw;
    display: flex;
    justify-content : space-between;
    align-items: center;
    background-color: #111;
    padding: 1.5625vw 1.5625vw 0 !important;

    .payload-wrap {
      display: flex;
      gap: 0.78125vw;

      .payload-info {
        width: 17.1875vw;
        height: 3.90625vw;
        background-color: #404144;;
        border-radius: 0.78125vw;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        font-size: 1.5625vw;
        letter-spacing: -0.0390625vw;
        color: #ddd;
      }

      .payload-active {
        background-color: #fff;
        font-weight: bold;
        color: #000;
      }
    }

    .event-filter {
      display: flex;
      align-items: center;
      gap: 0.3906vw;

      .event-text {
        color: #fff;
        font-family: "Spoqa Han Sans Neo", "sans-serif";
        font-size: 1.71875vw;
      }
    }
  }

  .wrap-order-list {
    flex:1;
    width: 84.53125vw;
    background-color: #111;
    padding: 0 1.5625vw !important;
    box-sizing: border-box;

    .order-title-list {
      display: grid;
      grid-template-columns: 11.71875vw 5.46875vw 9.375vw 9.375vw 9.375vw 3.75vw 10.3125vw 8.90625vw 4.375vw;
      gap: 0.78125vw;
      padding: 3.75vh 0.78125vw 1.25vh !important;
      border-bottom: solid 0.078125vw #333333;
      box-sizing: border-box;
      justify-content: center;


      .order-title {
        font-size: 1.09375vw;
        color: #fff;
        text-align: center;
      }
    }

    .remake-paid {
      grid-template-columns: 12.71875vw 6.46875vw 10.375vw 10.375vw 4.75vw 11.3125vw 10.90625vw 4.375vw;
    }

    // 결제 포함 버전
    .wrap-order-information-lists {
      height: calc(92.5vh - 12.65125vw);
      overflow: auto;
      .order-information-lists {
        .order-information-list {
          height: 4.375vw;
          padding: 0 0.78125vw !important;
          display: grid;
          grid-template-columns: 11.71875vw 5.46875vw 9.375vw 9.375vw 9.375vw 3.75vw 10.3125vw 8.90625vw 4.375vw;
          justify-content: center;
          align-items: center;
          gap: 0.78125vw;
          box-sizing: border-box;

          > p {
            font-size: 2.03125vw;
            letter-spacing: -0.05rem;
            text-align: center;
            color: #fff;
            border-radius: 0.390625vw;
          }

          .order-information-table-number {
            font-size: 2.1875vw;
          }

          .order-information-order-time {
            background-color: #fff;
            color: #000;
            font-weight: bold;
          }

          .orderColorRed {
            background-color: #fc0000;
          }
          .orderColorBlue {
            background-color: #33a6ff;
          }
          .orderColorGreen {
            background-color: #1e9d2f;
          }
          .orderColorYellow {
            background-color: #e5a11a;
          }
          .orderColorOrange {
            background-color: #FF7A00;
          }

          .orderFontColorBlue {
            color: #33a6ff;
          }
          .orderFontColorGreen {
            color: #1e9d2f;
          }
          .orderFontColorYellow {
            color: #e5a11a;
          }
          .orderFontColorOrange {
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

          .order-information-total-people {
            height: 2.65625vw;
            background-color: #fc0000;
            color: #fff;
            font-weight: bold;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 0.390625vw;
          }
        }

        .remake-paid {
          grid-template-columns: 12.71875vw 6.46875vw 10.375vw 10.375vw 4.75vw 11.3125vw 10.90625vw 4.375vw;
        }
      }

      .bg-black {
        background-color: #111;
      }

      .confirm-status {
        background-color: #fff;

        .order-information-list {
          .orderColorBlue,
          .orderColorGreen,
          .orderColorRed,
          .orderColorYellow,
          .orderColorOrange {
            color: #fff;
            background-color: #000;
          }

          .orderFontColorBlue,
          .orderFontColorGreen,
          .orderFontColorYellow,
          .orderFontColorOrange {
            color: #000;
          }

          > p {
            color: #000;
          }

          .order-information-total-people {
            background-color: #000;
            color: #fff;
          }

          .order-information-order-time {
            background-color: #000;
            color: #fff;
          }
        }
      }
    }

    // 결제미포함 버전
    .electronic-access-list-version {
      display: grid;
      grid-template-columns: 7.18125vw 19.53125vw 1fr 9.375vw 6.375vw;
      gap: 0.78125vw;
      padding: 3.75vh 0.78125vw 1.25vh !important;
      border-bottom: solid 0.078125vw #333333;
      box-sizing: border-box;

      .order-title {
        font-size: 1.09375vw;
        color: #fff;
        text-align: center;
      }
    }

    .wrap-order-information-lists-electronic {
      height: calc(92.5vh - 12.65125vw);
      overflow: auto;
      .order-information-lists {
        .order-information-list {
          min-height: 6.375vw;
          padding: 0 0.78125vw !important;
          display: grid;
          grid-template-columns: 7.18125vw 19.53125vw 1fr 9.375vw 6.375vw;
          align-items: center;
          gap: 0.78125vw;
          box-sizing: border-box;

          > p {
            font-size: 2.03125vw;
            letter-spacing: -0.05rem;
            text-align: center;
            color: #fff;
            border-radius: 0.390625vw;
          }

          .orderColorRed {
            background-color: #fc0000;
          }
          .orderColorBlue {
            background-color: #33a6ff;
          }
          .orderColorGreen {
            background-color: #1e9d2f;
          }
          .orderColorYellow {
            background-color: #e5a11a;
          }
          .orderColorOrange {
            background-color: #FF7A00;
          }

          .order-information-table-number {
            font-size: 3.75vw;
            font-weight: bold;
          }

          .order-information-goods-name {
            font-size: 2.734375vw;
          }

          .order-information-unpaid-money {
            color: #999;
            .unpaid {
              color: #fc0000;
              text-decoration: underline;
            }
          }

          .order-information-people-group {
            height: 2.65625vw;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-radius: 0.390625vw;

            .wrap-small-text {
              word-break: keep-all;
              .small-text {
                color: #fff;
                font-size: 1.25vw;
              }
            }

            .red-box {
              min-width: 6.375vw;
              height: 2.65625vw;
              background-color: #fc0000;
              font-size: 2.5vw;
              color: #fff;
              font-weight: bold;
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 0.390625vw;
            }
          }

          .order-information-total-people {
            display: flex;
            justify-content: center;
            align-items: center;

            > span {
              min-width: 4.375vw;
              height: 2.65625vw;
              background-color: #fc0000;
              color: #fff;
              font-weight: bold;
              border-radius: 0.390625vw;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        }
      }

      .bg-black {
        background-color: #111;
      }

      .confirm-status {
        background-color: #fff !important;

        .order-information-list {
          .orderColorBlue,
          .orderColorGreen,
          .orderColorRed,
          .orderColorYellow,
          .orderColorOrange {
            color: #fff;
            background-color: #000;
          }

          .orderFontColorBlue,
          .orderFontColorGreen,
          .orderFontColorYellow,
          .orderFontColorOrange {
            color: #000;
          }

          > p {
            color: #000;
          }


          .order-information-order-time {
            background-color: #000;
            color: #fff;
          }
        }
      }
    }
  }
}

</style>