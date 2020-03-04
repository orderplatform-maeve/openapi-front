<template lang="pug">
#display(@click="back")
  div.logo(
    v-show="isLogo"
    :style="{backgroundImage: `url(${logoUri})`}"
  )
  .left-side(v-if="!isLogo")
    .order-title(v-if="newOrder")
      .table-number(:class="getTableNumberClass(newOrder)") {{checkedTabletNum(newOrder)}}
      .people_total_count(v-if="visibleCustomerCount(newOrder)") {{checkedTotalPeople(newOrder)}}명
      .msg
        span.title(v-if="visibleCall(newOrder)") 호출이요
        span.title(v-else-if="isDoneSetting(newOrder)") 셋팅완료
        span.title(v-else) 주문이요
        .icon.visit(v-if="isFirstEntered(newOrder)") 입장
        .icon.first(v-if="isFirstOrder(newOrder)") 첫 주문
      .msg-time
        .commit(:class="getMsgTimeClass(newOrder)") {{vaildCommitText(newOrder)}}
        .time {{getOrderTiem(newOrder)}}

    .wrap-people-list(v-if="newOrder")
      ul.people-list
        li.people-item(v-if="isPeopleCnt(people)" v-for="people in getPeopleJson(newOrder)")
          .count {{getPeopleCnt(people)}}명
          .name {{getPeopleName(people)}}

    .wrap-product-list(v-if="newOrder")
      ul.product-list
        li.product-item(v-for="product in getOrderInfo(newOrder)")
          .count {{getProductQty(product)}}개
          .name {{getProjectGoodName(product)}}
          .memo(v-if="isProductMemoShow(product)") {{getProductMemo(product)}}
          ul.option-list(v-if="isProductOpt(product)")
            li.option-item(v-for="option in product.option")
              span +
              .count {{getOptionGoodQty(option)}}개
              .name {{getOptionDisplayName(option)}}

    .title 이전주문내역
    ul.c-product-list(v-if="newOrder")
      li.order-item(v-for="c_product in newOrder.total_orders")
        .name {{getBeforeProductDisplayName(c_product)}}
        .count {{getBeforeProductOrderQty(c_product)}}개
        ul.option-list(v-if="isBeforeProductOtp(c_product)")
          li.option-item(v-for="option in c_product.option")
            span +
            .count {{getBeforeProductOptionOrderQty(option)}}개
            .name {{getBeforeProductOptionDisplayName(option)}}

  .right-side(v-if="!isLogo")
    ul.order-list()
      li.order-item(
        v-for="order in sortedOrders"
        :class="getOrderItemClass(order)"
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
import * as logo from '@assets/images/logo.gif';

export default {
  data () {
    return {
      viewMode: 'a',
      logoUri: null,
      isLogo: false,
      timeoutId: null,
    };
  },
  computed: {
    sortedOrders() {
      const { orders } = this.$store.state;
      return orders.sort((a, b) => b.timestamp - a.timestamp);
    },
    newOrder() {
      return this.$store.state.displayNewOrder;
    },
  },
  watch: {
    isLogo(val) {
      if (!val && !!this.timeoutId) {
        console.log('clearTimeout', val, this.timeoutId);
        clearTimeout(val);
        this.timeoutId = null;
        this.logoUri = null;
      }
    },
    newOrder() {
      if(!this.timeoutId && !this.isLogo) {
        this.setLogoUri();
        this.isLogo = true;
        this.closeLogo();
      }
    },
  },
  created() {
    this.setLogoUri();
  },
  methods: {
    preloadImage(image) {
      const img = new Image();
      img.onload = () => {
        this.logoUri = img.src;
      };
      img.src = image;
    },
    setLogoUri() {
      const imageUri = this.getRandomLogoUri();
      this.preloadImage(imageUri);
    },
    getRandomLogoUri() {
      return `${logo}?a=${Math.random()}`;
    },
    closeLogo() {
      console.log('closeLogo');
      this.timeoutId = setTimeout(() => {
        this.isLogo = false;
      }, 3000);
    },
    getPeopleJson(newOrder) {
      if (!newOrder || !newOrder.people_json) {
        return [];
      }
      return newOrder.people_json;
    },
    getOrderInfo(order) {
      console.log('getOrderInfo', order);
      try {
        return order.order_info;
      } catch (error) {
        return [];
      }
    },
    getOrderItemClass(order) {
      return {
        commit: this.checkedCommit(order),
      };
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
    back() {
      this.$router.back();
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
  .logo {
    display: flex;
    flex-grow: 1;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
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

    .title {
      display:flex;
      flex-shrink:0;
      align-items: center;
      justify-content: center;
      height:40px;
      font-size:20px;
      font-weight:700;
      background-color:#ffffff;
      color:#000000;
      border-radius:100px;
    }

    .c-product-list {
      flex-grow:1;
      font-size:20px;
      display:flex;
      flex-direction:column;
      margin:0;
      padding:0;
      list-style:none;
      word-break: keep-all;
      overflow:scroll;
      -webkit-overflow-scrolling: touch;

      .order-item {
        display:flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin:0;
        padding:8px 0;
        font-size:20px;
        align-items: flex-start;

        border {
          bottom:solid 1px #484848;
        }

        .option-list {
          display:flex;
          flex-direction:column;
          margin:0;
          padding:0;
          font-size:0.8em;
          width:100%;

          .option-item {
            display:flex;
          }
        }

        .name {
          flex-grow:1;
          word-break:break-all;
        }
        .count {
          margin-left:12px;
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
