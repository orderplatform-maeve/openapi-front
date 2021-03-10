<template lang="pug">
#orders
  .top_menu
    .menu(@click="setViewMode('a')" :class="activeAllTabBtnClass")
      | 모든 주문 
      span {{lengthOrders}}
    .menu(@click="setViewMode('n')" :class="activeUnidentifiedTabBtnClass")
      | 미확인 주문  
      span {{unidentifiedOrders}}
    .menu(@click="setViewMode('c')" :class="activeCheckedTabBtnClass")
      | 확인주문
      span {{lengthCommitedOrders}}

  .list_box
    ul.order_list
      li.order-item(
        v-for="order in sortedOrders"
        v-if="visibleOrderItem(order)"
      )
        a(@click="view(order)")
          .tn(v-bind:class="{ bg_red: order.viewType==1 || order.viewType==0, bg_blue: order.viewType==2, bg_green: order.viewType==3, bg_yellow: order.viewType==4}") {{checkedTabletNum(order)}}
          .txt1
            template(v-if="order.viewType==0") 첫주문
            template(v-if="order.viewType==1") 주문
            template(v-if="order.viewType==2") 호출
            template(v-if="order.viewType==3") 세팅완료
            template(v-if="order.viewType==4") 평가
          .check(v-bind:class="getOrderItemClass(order)") 확인
          .txt2
            template(v-if="order.paidOrder") 선불
            template(v-else) 후불
          div(v-bind:class="{txt4: order.creditStat==false, txt3:order.creditStat==true || order.paidOrder==false}")
            template(v-if="order.creditType=='cash'") 현금 
            template(v-if="order.creditType=='card'") 카드 
            template(v-if="order.creditType=='complex'") 카드+현금
            template(v-if="order.paidOrder==false") &nbsp;&nbsp;&nbsp;&nbsp;
          .date {{getOrderTiem(order)}}
          .btn_orderList 주문내역 

//#orders
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
  .loading(v-if="isLoading") 데이터 요청 중 입니다.
  ul.order-list(v-if="!isLoading")
    li.order-item(
      v-for="order in sortedOrders"
      :class="getOrderItemClass(order)"
      @click="view(order)"
      v-if="visibleOrderItem(order)"
    )
      .table-number(:class="getTableNumberClass(order)") {{checkedTabletNum(order)}}
      .people_total_count(v-if="visibleCustomerCount(order)") {{checkedTotalPeople(order)}}명
      .msg
        span.title(v-if="visibleCall(order)") 호출이요
        span.title(v-else-if="isDoneSetting(order)") 셋팅완료
        span.title(v-else-if="isRating(order)") {{getRatingText(order.rating_type)}}
        span.title(v-else) 주문이요
        .icon.visit(v-if="isFirstEntered(order)") 입장
        .icon.first(v-if="isFirstOrder(order)") 첫 주문
      .msg-time
        .commit(:class="getMsgTimeClass(order)") {{validCommitText(order)}}
        .time {{getOrderTiem(order)}}
</template>

<script>
import utils from '@utils/orders.utils';

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
