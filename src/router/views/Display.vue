<template lang="pug">
#display
  .left-side
    h1 최근 주문
    .order-title
      .table-number(:class="getTableNumberClass(order)") {{checkedTabletNum(order)}}
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

    .wrap-people-list
      ul.people-list
        li.people-item(v-for="people in order.people_json" v-if="isPeopleCnt(people)")
          .count {{getPeopleCnt(people)}}명
          .name {{getPeopleName(people)}}

    .wrap-product-list
      ul.product-list
        li.product-item(v-for="product in order.order_info")
          .count {{getProductQty(product)}}개
          .name {{getProjectGoodName(product)}}
          .memo(v-if="isProductMemoShow(product)") {{getProductMemo(product)}}
          ul.option-list(v-if="isProductOpt(product)")
            li.option-item(v-for="option in product.option")
              span +
              .count {{getOptionGoodQty(option)}}개
              .name {{getOptionDisplayName(option)}}
  .right-side
    h1 주문 목록
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
    order() {
      return this.$store.state.displayNewOrder;
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
    /* background-color: skyblue; */

    .order-title {
      @include order-title;
      padding: 10px;
    }

    .wrap-people-list {
      display:flex;
      height:48px;
      margin-bottom:12px;
      font-size:36px;
      font-weight:900;

      .people_total_count {
        display:flex;
        align-items: center;
        justify-content: center;
        border-radius: 100px;
        background-color: #ffffff;
        color: #000000;
        padding: 0 12px;
      }
      .people-list {
        margin:0;
        padding:0;
        display:flex;
        font-size:32px;

        .people-item {
          display:flex;
          align-items: center;
          justify-content: center;
          margin:0;
          padding:0;
          display:flex;
          margin-right:12px;
          padding-right:12px;
          border-left: solid 1px #444444;
          .count {
            margin-right:8px;
          }
        }
        .people-item:first-child {
          border:none;
        }
      }
    }

    .wrap-product-list {
      display:flex;
      flex-direction:column;
      flex-grow:1;
      padding-left: 20px;

      .product-list {
        display:flex;
        flex-direction:column;
        word-break: keep-all;
        margin:0;
        padding:0;
        overflow:scroll;
        -webkit-overflow-scrolling: touch;

        .product-item {
          display:flex;
          flex-shrink:0;
          flex-direction: row;
          flex-wrap: wrap;
          align-items: stretch;
          word-break:break-all;
          margin-bottom:12px;
          font-size:48px;
          font-weight:900;

          .option-list {
            display:flex;
            flex-direction:column;
            margin:0;
            padding:0;
            font-size:0.8em;
            width:100%;

            .option-item {
              display:flex;
              margin-left:88px;
            }
          }
          .memo {
            display:flex;
            align-items: center;
            border-radius:100px;
            border:solid 3px #ffffff;
            padding:0 12px;
            font-size:0.6em;
            margin-left:12px;
          }
          .count {
            margin-right:24px;
            text-align:right;
          }
          .first {
            margin-left:12px;
            display:flex;
            align-items: center;
            justify-content: center;
            padding:0 24px;
            border-radius:100px;
            height:48px;
            background-color:#ffffff;
            color:#000000;
            font-size:24px;
            font-weight:900;
          }
        }
      }
    }

  }
  .right-side {
    width: 50%;
    /* background-color: salmon; */
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
          top:solid 1px silver;
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
