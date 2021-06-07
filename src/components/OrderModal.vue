<template lang="pug">
.popup.order_list
  .top_wrap.clearfix
    span.fleft.tn.bg_red {{checkedTabletNum(order)}}
    h1 주문내역
    span.fright
      a.btn_close(v-on:click="closeOrder")
        svg(xmlns='http://www.w3.org/2000/svg' width='28.242' height='29.242' viewbox='0 0 28.242 29.242')
          g(transform='translate(2.303 2.486)')
            line(x1='24' y2='25' transform='translate(-0.182 -0.365)' fill='none' stroke='#fff' stroke-linecap='round' stroke-width='3')
            line(x2='24' y2='25' transform='translate(-0.182 -0.365)' fill='none' stroke='#fff' stroke-linecap='round' stroke-width='3')
    span.fright.date {{order.order_time}}
    span.fright.check(v-bind:class="{'on': order.commit == true}")
      template(v-if="order.commit == true") 확인
      template(v-if="order.commit == false") 미확인
  .details_wrap.clearfix
    .details_left
      p 현재 주문내역
      ul.list
        li(v-for="product in order.order_info")
          ul.group
            li.fleft.txt1 {{getProjectGoodName(product)}}
            li.fleft.txt3 {{ getItemPrice(product) }}원
            li.fright.txt2 {{getProductQty(product)}}개
            li.fleft.option(v-if="isProductOpt(product)")
              div(v-for="option in product.option") {{getOptionDisplayName(option)}} {{getOptionGoodQty(option)}}개
    .details_right(v-if="!order.paidOrder")
      p 이전 주문내역
      ul(v-if="order.paidOrder==false")
        li(v-for="c_product in order.total_orders")
          dl
            dt.fleft {{getBeforeProductDisplayName(c_product)}}
            dd.fright {{getBeforeProductOrderQty(c_product)}}개
            dd.fleft.option(v-if="isBeforeProductOtp(c_product)")
              div(v-for="option in c_product.option") {{getBeforeProductOptionDisplayName(option)}} {{getBeforeProductOptionOrderQty(option)}}개.
    .details_right(v-if="order.paidOrder")
      p 결제내역
      ul()
        li(v-for="c_product in order.creditArray")
          dl
            dt.fleft {{ getProductAmount(c_product) }}
              dd.fright {{ getProductOrderType(c_product) }}
    .details_right(v-if="getVisibleCancelListArea(order)")
      p 결제 취소 내역
      ul()
        li(v-for="c_product in order.cancelArray")
          dl
            dt.fleft {{ getProductAmount(c_product) }}
              dd.fright {{ getProductOrderType(c_product) }}
  .btm
    p {{seconds}}초 후 닫혀요.
    a(@click="commitOrder(order)") 확인
</template>

<script>
import StarRating from 'vue-star-rating';

import utils from '@utils/orders.utils';
import { won } from '@utils/regularExpressions';

export default {
  components: {
    'star-rating': StarRating,
  },
  data() {
    return {
      interval: undefined,
      seconds: 10,
      isConfirm: false,
    };
  },
  computed: {
    order() {
      // console.log(this.$store.state.order.rating_type);
      return this.$store.state.order;
    },
  },
  mounted() {
    console.log(this.$store.state.order);

    clearInterval(this.interval);
    this.seconds = 10;

    this.interval = setInterval(() => {
      this.seconds -= 1;

      if (this.seconds < 1) {
        this.closeOrder();
      }
    }, 1000);
  },
  beforeDestroy() {
    this.closeOrder();
  },
  sockets: {
    orderview(payload) {
      if (payload?.type_msg === 'commit') {
        // console.log('local');
        clearInterval(this.interval);
        this.isConfirm = false;
      }
    },
  },
  methods: {
    getVisibleCancelListArea(order) {
      try {
        return order.cancelArray.length > 0;
      } catch (error) {
        return false;
      }
    },
    getProductAmount(order) {
      try {
        return won(order.amount);
      } catch (error) {
        return 0;
      }
    },
    getProductOrderType(order) {
      try {
        return order.order_type === 'cash' ? '현금' : '카드';
      } catch (error) {
        return 'order_type가 없습니다.';
      }
    },
    getItemPrice(order) {
      try {
        return won(order.good_price);
      } catch (error) {
        return 0;
      }
    },
    async commitOrder(order) {
      const auth = this.$store.state.auth;
      this.isConfirm = true;

      const { disconnected } = this.$socket.connect();

      console.log('disconnected', disconnected);

      if (disconnected) {
        const targetOrder = {
          commit: !order.commit,
          order_view_key: order.order_view_key,
          T_order_order_tablet_number: order.T_order_order_tablet_number,
          order_time: order.order_time,
        };

        this.$store.commit('UPDATE_ORDERS', targetOrder);
        // this.$store.commit('pushFlashMessage', `${targetOrder.T_order_order_tablet_number} 테이블 주문이(${targetOrder.order_time}) ${targetOrder.commit ? '확인' : '미확인'} 상태로 변경 되었습니다.`);
      }

      try {
        // eslint-disable-next-line no-unused-vars
        const { data } = await this.$store.dispatch('commitOrder', { auth, order });
        console.log('commitOrder', data);

        if (!data.result) {
          console.log('주문 확인 응답값 실패');

          const targetOrder = {
            commit: !order.commit,
            order_view_key: order.order_view_key,
            T_order_order_tablet_number: order.T_order_order_tablet_number,
            order_time: order.order_time,
          };

          this.$store.commit('UPDATE_ORDERS', targetOrder);
        }

        this.closeOrder();
        this.isConfirm = false;
      } catch (error) {
        this.closeOrder();
        this.$store.commit('pushFlashMessage', '네트워크 이상이 있으니 잠시 후 다시 시도 해주세요.');
        this.isConfirm = false;
      }
    },
    closeOrder() {
      clearInterval(this.interval);
      this.$store.commit('UNSET_ORDER');
    },
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
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        .good-name {
          font-size: 48px;
          font-weight: 900;
        }
        .raitng-item {
          font-size: 48px;
          margin-top: 12px;
          font-weight: 900;
        }
        .word {
          margin-top: 8px;
          margin-bottom: 0;
          font-size: 40px;
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
          flex-shrink:1;
          flex-grow:1;
          padding-left:24px;
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
