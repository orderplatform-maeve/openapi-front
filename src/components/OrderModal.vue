<template lang="pug">
#order
  .background
  .container
    .container-top
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
      .button.button-close(v-on:click="closeOrder") 닫기
    .container-body
      .left
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
      .right
        .wrap-c-product-list()
          .title 이전주문내역
          ul.c-product-list
            li.order-item(v-for="c_product in order.total_orders")
              .name {{getBeforeProductDisplayName(c_product)}}
              .count {{getBeforeProductOrderQty(c_product)}}개
              ul.option-list(v-if="isBeforeProductOtp(c_product)")
                li.option-item(v-for="option in c_product.option")
                  span +
                  .count {{getBeforeProductOptionOrderQty(option)}}개
                  .name {{getBeforeProductOptionDisplayName(option)}}
    .container-foot
      .msg {{seconds}}초 후 닫혀요.
      .buttons
        .button.button-commit(v-on:click="commitOrder(order)") 확인
</template>

<script>
import utils from '@utils/orders.utils';

const peopleMethods = {
  isPeopleCnt(people) {
    if (!people) return false;
    return people.count > 0;
  },
  getPeopleCnt(people) {
    if (!people) return 0;
    return people.count;
  },
  getPeopleName(people) {
    if (!people) return '';
    return people.name;
  },
};

const productMethods = {
  getProductQty(product) {
    if (!product) return 0;
    return product.good_qty;
  },
  getProjectGoodName(product) {
    if (!product) return '';
    return product.good_name;
  },
  isProductMemoShow(product) {
    if(!product) return false;
    return product.memo_show;
  },
  getProductMemo(product) {
    if (!product) return '';
    return product.memo;
  },
  isProductOpt(product) {
    if(!product) return false;
    return product.option;
  },
  getOptionGoodQty(option) {
    if (!option) return 0;
    return option.good_qty;
  },
  getOptionDisplayName(option) {
    if (!option) return '';
    return option.display_name;
  },
};

const beforeProductMethods = {
  getBeforeProductDisplayName(cProduct) {
    if (!cProduct) return '';
    return cProduct.display_name;
  },
  getBeforeProductOrderQty(cProduct) {
    if (!cProduct) return 0;
    return cProduct.order_qty;
  },
  isBeforeProductOtp(cProduct) {
    if (!cProduct) return false;
    return cProduct.option;
  },
  getBeforeProductOptionOrderQty(option) {
    if (!option) return 0;
    return option.order_qty;
  },
  getBeforeProductOptionDisplayName(option) {
    if (!option) return '';
    return option.display_name;
  },
};

export default {
  data() {
    return {
      interval: undefined,
      seconds: 10,
    };
  },
  computed: {
    order() {
      return this.$store.state.order;
    },
  },
  mounted() {
    clearInterval(this.interval);
    this.seconds = 10;
    this.interval = setInterval(() => {
      this.seconds -= 1;

      if(this.seconds < 1) {
        this.closeOrder();
      }
    }, 1000);
  },
  beforeDestroy() {
    this.closeOrder();
  },
  methods: {
    commitOrder(order) {
      let auth = this.$store.state.auth;
      this.$store.dispatch("commitOrder", { auth, order });
      this.$socket.emit('syncCommitOrder', order);
    },
    closeOrder() {
      clearInterval(this.interval);
      this.$store.dispatch('unsetOrder');
    },
    ...peopleMethods,
    ...productMethods,
    ...beforeProductMethods,
    ...utils,
  },
};
</script>

<style lang="scss">
@import "../scss/global.scss";

#order {
  position:fixed;
  top:0;
  left:0;
  display:flex;
  align-items: center;
  justify-content: center;

  width:100%;
  height:100%;
  z-index:101;

  .background {
    position:absolute;
    top:0;
    left:0;
    display:flex;
    width:100%;
    height:100%;
    z-index:102;
    background-color:rgba(0,0,0,0.8);
  }

  .container {
    display:flex;
    padding:24px !important;
    flex-direction:column;
    align-items: center;
    justify-content: center;
    width:80%;
    height:80%;
    z-index:103;
    border:solid 2px #ffffff;
    border-radius:24px;
    flex-grow:0 !important;
    background-color:rgba(0,0,0,0.9);

    .container-top {
      display:flex;
      width:100%;
      flex-shrink:0;
      .order-title {
        flex-grow:1;
        @include order-title;
        margin-bottom:12px;
      }
      .button-close {
        margin-left:12px;
        display:flex;
        align-items: center;
        justify-content: center;
        padding:0 36px;
        font-size:24px;
        height:60px;
        background-color:#ffffff;
        color:#202020;
        border-radius:100px;
        flex-shrink:0;
      }
    }
    .container-body {
      display:flex;
      flex-direction:row;
      flex-grow:1;
      flex-shrink:1;
      width:100%;
      overflow:scroll;

      .left {
        display:flex;
        flex-direction:column;
        flex-grow:1;

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
      .right {
        display:flex;
        flex-direction:column;
        flex-grow:1;

        .wrap-c-product-list {
          display:flex;
          flex-direction:column;
          //margin-left:24px;
          //margin-bottom:24px;
          flex-shrink:1;
          flex-grow:1;
          padding-left:24px;
          //border-left:solid 1px #808080;
          min-width:200px;

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
      }
    }
  }
  .container-foot {
    display:flex;
    flex-direction:column;
    align-items: center;
    justify-content: center;
    width:100%;
    flex-shrink:0;
    .msg {
      display:flex;
      align-items: center;
      justify-content: center;
      width:100%;
      font-size:20px;
      height:60px;
    }
    .buttons {
      display:flex;
      align-items: center;
      justify-content: center;
      width:100%;
      .button {
        margin:0;
        display:flex;
        flex-grow:1;
        align-items: center;
        justify-content: center;
        height:80px;
        border-radius:100px;
        font-size:24px;
        font-weight:900;
        background-color:#ffffff;
        color:#202020;
        margin-left:24px;
      }
      .button:first-child {
        margin-left:0;
      }
      .button-commit {
        flex-grow:1;
        background-color:#ff0000;
        color:#ffffff;
      }
    }
  }
}
</style>
