<template lang="pug">
.order-modal-container
  .wrap-order-modal
    .order-modal-header
      .wrap-order-history-text
        p.order-history-text {{ getByTypeText('title') }}
        p.order-table-name {{checkedTabletNum(order)}} 테이블
      .wrap-order-time
        .order-confirm-check
          .check-svg(:class="{checkOn: order.commit == true}")
          p.order-confirm-status(v-if="order.commit == true") 확인
          p.order-confirm-status(v-else) 미확인
        p.bar
        p.order-time {{order.order_time}}
    .wrap-order-history-all
      .wrap-current-order-history
        p.current-order-history-text {{ getByTypeText('sub') }}
        .current-order-history-list
          .current-order-history(v-for="product in order.order_info")
            .wrap-product-info
              .current-product-info
                p.product-name {{getProjectGoodName(product)}}
                .wrap-product-price
                  //- p.product-quantity {{getProductQty(product)}}개
                  p.product-price
                    span(v-if="standardPriceFrontPosition") {{standardPriceUnit}}
                    span {{ getItemPrice(product) }}
                    span(v-if="!standardPriceFrontPosition") {{standardPriceUnit}}
              .product-option-list(v-if="isProductOpt(product)")
                product-option-item(
                  v-for="(option, index) in product.option"
                  :key="getOptionItemKey(option, index)"
                  :option-info="option"
                  :standard-price-unit="standardPriceUnit"
                  :standard-price-front-position="standardPriceFrontPosition"
                  :is-first-option="true"
                  :get-option-item-key="getOptionItemKey"
                )
            .wrap-product-all-price
              p.product-all-price-title
                | 상품 수량
              .wrap-product-unit-total-price
                p.product-unit-total-quantity {{getProductQty(product)}}개
                p.product-unit-total-price
                  span(v-if="standardPriceFrontPosition") {{standardPriceUnit}}
                  span {{getItemUnitTotalPrice(product)}}
                  span(v-if="!standardPriceFrontPosition") {{standardPriceUnit}}
      .wrap-last-order-history(v-if="getUserPhoneNumber")
        p.last-order-history-text 휴대폰 번호
        .last-order-history-list
          p.phone-number {{getUserPhoneNumber}}
      .wrap-last-order-history(v-else-if="!order.paidOrder && order.viewType !== 6")
        p.last-order-history-text 이전 주문내역
        .last-order-history-list(v-if="order.paidOrder === false")
          .last-order-history(v-for="c_product in order.total_orders")
            .last-product-info
              .last-order-product-name {{getBeforeProductDisplayName(c_product)}}
              .last-order-product-quantity {{getBeforeProductOrderQty(c_product)}}개
            .last-order-product-option-list(v-if="isBeforeProductOtp(c_product)")
              previous-order-option-item(
                v-for="(option, index) in c_product.option"
                :key="getPreviousOptionItemKey(option, index)"
                :option-info="option"
                :get-previous-option-item-key="getPreviousOptionItemKey"
              )
      .wrap-last-order-history(v-else-if="order.paidOrder && order.viewType !== 6")
        p.last-order-history-text.credit-history 결제내역
        .last-order-history-list
          .last-order-history(v-for="c_product in order.creditArray")
            .last-product-info
              .last-order-product-name
                span(v-if="standardPriceFrontPosition") {{standardPriceUnit}}
                span {{ getProductAmount(c_product) }}
                span(v-if="!standardPriceFrontPosition") {{standardPriceUnit}}
              .last-order-product-quantity.credit-type {{ getProductOrderType(c_product) }}
      .wrap-last-order-history(v-else-if="getVisibleCancelListArea(order) && order.viewType !== 6")
        p.last-order-history-text.credit-history 결제 취소 내역
        .last-order-history-list
          .last-order-history(v-for="c_product in order.cancelArray")
            .last-product-info
              .last-order-product-name {{ getProductAmount(c_product) }}
              .last-order-product-quantity.credit-type {{ getProductOrderType(c_product) }}
    .wrap-confirm-button
      button.close-button(@click="closeOrder") 닫기
      button.confirm-button(@click="commitOrder(order)" v-if="order.commit == true") 미확인으로 변경
      button.confirm-button(@click="commitOrder(order)" v-else) 확인으로 변경
      span.confirm-time-message {{seconds}}초 후 닫혀요.
</template>

<script>
import StarRating from 'vue-star-rating';
import utils from '@utils/orders.utils';
import { won } from '@utils/regularExpressions';
import ProductOptionItem from "@components/ProductOptionItem.vue";
import PreviousOrderOptionItem from "@components/PreviousOrderOptionItem.vue";

export default {
  components: {
    'product-option-item': ProductOptionItem,
    'previous-order-option-item': PreviousOrderOptionItem,
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
    getUserPhoneNumber() {
      const userPhoneNumber = this.$store.state.order?.userHP || false;

      return userPhoneNumber;
    },
    standardPriceUnit() {
      const standardPriceUnit = this.$store.state.standardPriceUnit;
      return standardPriceUnit;
    },
    standardPriceFrontPosition() {
      const standardPriceFrontPosition = this.$store.state.standardPriceFrontPosition;
      return standardPriceFrontPosition;
    }
  },
  mounted() {
    clearInterval(this.interval);

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
    getByTypeText(type) {
      if (type === 'title') {
        const isViewTypeGame = this.order?.viewType === 6;
        if (isViewTypeGame) {
          return '게임내역';
        } else {
          return '주문내역';
        }
      }
      if (type === 'sub') {
        const isViewTypeGame = this.order?.viewType === 6;
        if (isViewTypeGame) {
          return '게임 결과';
        } else {
          return '현재주문내역';
        }
      }

    },
    getClassType(obj) {
      return Object.prototype.toString.call(obj).slice(8,-1);
    },
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
    getOptionItemTotalPrice(totalPrice, option) {
      const {
        good_price,
        good_qty,
        options
      } = option;

      const calculatedPrice = totalPrice + (good_price * good_qty);

      if(options) {
        const optionPrice = options.reduce((acc, cur) => {
          if(options.length > 0) return acc + this.getOptionItemTotalPrice(0, cur);
          return acc;
        }, 0);

        return calculatedPrice + optionPrice;
      }

      return calculatedPrice;
    },
    getItemUnitTotalPrice(order) {
      const {
        good_price,
        good_qty,
        option = [],
      } = order;

      const productPrice = Number(good_price) * Number(good_qty);

      if(option) {
        const optionPrice = option.reduce((acc, cur) => acc + this.getOptionItemTotalPrice(0, cur), 0);

        return won(productPrice + optionPrice);
      }

      return won(productPrice);
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
      this.$store.commit('orderModalFlag', false);
      this.$store.commit('UNSET_ORDER');
    },
    ...utils,
    visitGroupInfo() {
      if(this.getClassType(this.order?.visitGroups?.groupInfo) === 'Object') {
        return this.order?.visitGroups?.groupInfo;
      }

      return false;
    },
    visitGroupTotal() {
      return this.order?.visitGroups?.total;
    },
    visitGroupStatus() {
      return this.order?.visitGroups?.length === 0;
    },
    electronicAccessCount() {
      return this.order.visitPeopleCnt;
    },
    getOptionItemKey(option, index) {
      if(option) return `${option.pos_code}-${index}`;
      return `option-item-${index}`;
    },
    getPreviousOptionItemKey(option, index) {
      if(option) return `previous-${option.pos_code}-${index}`;
      return `previous-option-item-${index}`;
    }
  },
};
</script>

<style lang="scss" scoped>
.order-modal-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.9375vw;
  z-index: 101;
  background-color: rgba(0, 0, 0, 0.85);

  // 매장별 white - black 설정할 때를 대비해 백업
  // .wrap-order-modal {
  //   width: 83.75vw;
  //   height: 76vh;
  //   background-color: #fff;
  //   border-radius: 1.5625vw;
  //   padding: 1.5625vw 0 !important;
  //   box-sizing: border-box;

  //   .order-modal-header {
  //     padding: 0.234375000vw 3.125vw 0.9375vw !important;
  //     display: flex;
  //     justify-content: space-between;
  //     border-bottom: solid 0.15625vw #fc0000;

  //     .wrap-order-history-text {
  //       display: flex;
  //       align-items: center;
  //       gap: 1.5625vw;

  //       .order-history-text {
  //         font-family: "notosans";
  //         font-size: 2.1875vw;
  //       }

  //       .order-table-name {
  //         font-family: 'Spoqa Han Sans Neo', 'sans-serif';
  //         font-size: 2.65625vw;
  //         font-weight: bold;
  //         letter-spacing: -0.03984375vw;
  //         color: #fc0000;
  //       }
  //     }

  //     .wrap-order-time {
  //       display: flex;
  //       align-items: center;
  //       gap: 2.34375vw;

  //       .order-confirm-check {
  //         font-family: 'Spoqa Han Sans Neo', 'sans-serif';
  //         font-size: 1.71875vw;
  //         display: flex;
  //         align-items: center;
  //         gap: 0.59375vw;

  //         .check-svg {
  //           width: 2.1vw;
  //           height: 2.109375vw;
  //           background-image: url('https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/orderview/uncheck.svg');
  //           background-size: contain;
  //           background-position: center center;
  //           background-repeat: no-repeat;
  //         }
  //         .checkOn{
  //           background-image: url("https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/orderview/check.svg");
  //         }
  //       }

  //       .bar {
  //         height: 1.875vw;
  //         border-left: solid 0.078125vw #707070;
  //       }

  //       .order-time {
  //         font-family: 'Spoqa Han Sans Neo', 'sans-serif';
  //         font-size: 2.03125vw;
  //         font-weight: bold;
  //       }
  //     }
  //   }
  //   .wrap-order-history-all {
  //     padding: 1.5625vw 3.90625vw !important;
  //     box-sizing: border-box;
  //     display: flex;
  //     gap: 4.0625vw;

  //     .wrap-current-order-history {
  //       width: 44.0625vw;

  //       .current-order-history-text {
  //         font-family: "notosans";
  //         font-weight: bold;
  //         font-size: 1.25vw;
  //         letter-spacing: -0.0625vw;
  //       }

  //       .current-order-history-list {
  //         height: calc(76vh - 17.96875vw);
  //         margin-top: 0.78125vw !important;
  //         display: flex;
  //         flex-direction: column;
  //         gap: 0.390625vw;
  //         overflow: scroll;

  //         .current-order-history {
  //           font-family: 'Spoqa Han Sans Neo', 'sans-serif';
  //           background-color: #f5f5f5;
  //           border: solid 0.078125vw #d6d6d6;
  //           border-radius: 0.78125vw;
  //           display: flex;
  //           flex-direction: column;
  //           padding: 1.5625vw !important;
  //           box-sizing: border-box;
  //           gap: 0.625vw;

  //           .current-product-info {
  //             display: flex;
  //             justify-content: space-between;
  //             align-items: center;

  //             .product-name {
  //               flex: 1;
  //               font-size: 1.71875vw;
  //               font-weight: bold;
  //               letter-spacing: -0.04296875vw;
  //             }

  //             .wrap-product-price {
  //               font-size: 1.5625vw;
  //               display: flex;
  //               gap: 3.125vw;

  //               .product-quantity {
  //                 width: 3.90625vw;
  //                 text-align: right;
  //               }
  //             }
  //           }

  //           .product-option-list {
  //             font-size: 1.40625vw;
  //             color: #666;
  //             letter-spacing: -0.02734375vw;

  //             .product-option {
  //               display: flex;
  //               justify-content: space-between;
  //               align-items: center;

  //               .option-name {
  //                 flex: 1;
  //               }

  //               .wrap-product-option-price {
  //                 display: flex;
  //                 gap: 3.125vw;

  //                 .option-quantity {
  //                   width: 3.90625vw;
  //                   text-align: right;
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }

  //     .wrap-last-order-history {
  //       flex: 1;

  //       .last-order-history-text {
  //         font-family: "notosans";
  //         font-size: 1.25vw;
  //         letter-spacing: -0.03125vw;
  //         border-bottom: solid 0.078125vw #666;
  //         padding-bottom: 0.78125vw !important;
  //         box-sizing: border-box;
  //       }

  //       .credit-history {
  //         color: #666;
  //       }

  //       .last-order-history-list {
  //         margin-top: 1.5625vw !important;
  //         height: calc(76vh - 19.53125vw);
  //         display: flex;
  //         flex-direction: column;
  //         gap: 1.171875vw;
  //         overflow: scroll;

  //         .last-order-history {
  //           display: flex;
  //           flex-direction: column;
  //           gap: 0.390625vw;

  //           .last-product-info {
  //             font-family: 'Spoqa Han Sans Neo', 'sans-serif';
  //             display: flex;
  //             justify-content: space-between;
  //             align-items: center;

  //             .last-order-product-name {
  //               font-size: 1.25vw;
  //               letter-spacing: -0.03125vw;
  //             }

  //             .last-order-product-quantity {
  //               font-size: 1.09375vw;
  //               letter-spacing: -0.02734375vw;
  //               color: #666;
  //             }
  //           }

  //           .last-order-product-option {
  //             font-family: 'Spoqa Han Sans Neo', 'sans-serif';
  //             font-size: 1.015625vw;
  //             color: #999;
  //             display: flex;
  //             justify-content: space-between;
  //             align-items: center;
  //           }
  //         }
  //       }
  //     }
  //   }

  //   .wrap-confirm-button {
  //     width: 100%;
  //     font-family: 'Spoqa Han Sans Neo', 'sans-serif';
  //     display: flex;
  //     align-items: center;
  //     gap: 3.515625vw;

  //     .close-button {
  //       flex: 1;
  //       height: 4.53125vw;
  //       margin-left: 3.90625vw !important;
  //       border: none;
  //       border-radius: 1.015625vw;
  //       background-color: #404144;
  //       font-family: 'Spoqa Han Sans Neo', 'sans-serif';
  //       font-size: 2.03125vw;
  //       font-weight: bold;
  //       color: #fff;
  //     }

  //     .confirm-button {
  //       display: block;
  //       width: 37.5vw;
  //       height: 4.53125vw;
  //       background-color: #fc0000;
  //       font-family: 'Spoqa Han Sans Neo', 'sans-serif';
  //       font-weight: bold;
  //       font-size: 2.03125vw;
  //       color: #fff;
  //       letter-spacing: -0.05078125vw;
  //       border: none;
  //       border-radius: 1.015625vw;
  //     }

  //     .confirm-time-message {
  //       width: 13.28125vw;
  //       margin-right: 3.125vw !important;
  //       text-align: right;
  //       font-weight: bold;
  //       font-size: 2.109375vw;
  //       letter-spacing: -0.05078125vw;
  //     }
  //   }
  // }

  .wrap-order-modal {
    width: 83.75vw;
    min-height: 80vh;
    background-color: #111;
    border: solid 0.15625vw #666;
    border-radius: 1.5625vw;
    padding: 1.5625vw 0 !important;
    box-sizing: border-box;

    .order-modal-header {
      padding: 0.234375000vw 3.125vw 0.9375vw !important;
      display: flex;
      justify-content: space-between;
      border-bottom: solid 0.15625vw #fc0000;
      gap: 0.78125vw;

      .wrap-order-history-text {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 1.5625vw;
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        color: #fff;

        .order-history-text {
          width: 8.59375vw;
          font-size: 2.1875vw;
        }

        .order-table-name {
          flex: 1;
          min-width: 11.71875vw;
          border-radius: 0.390625vw;
          text-align: center;
          font-size: 3.75vw;
          font-weight: bold;
          letter-spacing: -0.03984375vw;
          color: #fc0000;
          background-color: #fff;
          padding: 0 0.78125vw !important;
        }
      }

      .wrap-order-time {
        width: 31.25vw;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        text-align: right;
        gap: 1.5vw;

        .order-confirm-check {
          font-family: 'Spoqa Han Sans Neo', 'sans-serif';
          font-size: 1.71875vw;
          display: flex;
          align-items: center;
          gap: 0.59375vw;
          color: #fff;

          .check-svg {
            width: 2.1vw;
            height: 2.109375vw;
            background-image: url('https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/orderview/uncheck.svg');
            background-size: contain;
            background-position: center center;
            background-repeat: no-repeat;
          }
          .checkOn{
            background-image: url("https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/orderview/check.svg");
          }
        }

        .bar {
          height: 1.875vw;
          border-left: solid 0.078125vw #aaa;
        }

        .order-time {
          font-family: 'Spoqa Han Sans Neo', 'sans-serif';
          font-size: 2.03125vw;
          color: #fff;
          font-weight: bold;
        }
      }
    }
    .wrap-order-history-all {
      padding: 1.5625vw 3.90625vw !important;
      box-sizing: border-box;
      display: flex;
      gap: 2.34375vw;

      .wrap-current-order-history {
        width: 54.6875vw;

        .current-order-history-text {
          font-family: "notosans";
          font-weight: bold;
          color: #fff;
          font-size: 1.25vw;
          letter-spacing: -0.0625vw;
        }

        .current-order-history-list {
          height: calc(76vh - 17.96875vw);
          margin-top: 0.78125vw !important;
          display: flex;
          flex-direction: column;
          gap: 1.5625vw;
          overflow: scroll;

          .current-order-history {
            font-family: 'Spoqa Han Sans Neo', 'sans-serif';
            color: #fff;
            background-color: #292929;
            border-radius: 0.78125vw;
            display: flex;
            flex-direction: column;
            padding: 1.5625vw !important;
            box-sizing: border-box;
            gap: 0.625vw;
            .wrap-product-info {
              padding-bottom: 1.5625vw !important;
              display: flex;
              flex-direction: column;
              gap: 0.625vw;
              box-sizing: border-box;
              border-bottom: solid 0.078125vw #ccc;
              .current-product-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 0.390625vw;

                .product-name {
                  flex: 1;
                  font-size: 3.75vw;
                  font-weight: bold;
                  letter-spacing: -0.025em;
                }

                .wrap-product-price {
                  width: 21.25vw;
                  display: flex;
                  justify-content: flex-end;
                  align-items: center;
                  gap: 1.171875vw;

                  .product-quantity {
                    width: 7.96875vw;
                    text-align: right;
                    font-size: 3.75vw;
                    letter-spacing: -0.025em;
                  }

                  .product-price {
                    font-size: 1.953125vw;
                    width: 12.109375vw;
                    text-align: right;
                  }
                }
              }
              .product-option-list {
                font-size: 2.5vw;
                color: #eee;
                letter-spacing: -0.025em;
              }
            }

            .wrap-product-all-price {
              display: flex;
              justify-content: space-between;
              align-items: center;

              .product-all-price-title {
                font-size: 2.5vw;
              }

              .wrap-product-unit-total-price {
                width: 21.25vw;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 1.171875vw;
                font-size: 2.96875vw;
                font-weight: bold;

                .product-unit-total-quantity {
                  width: 7.96875vw;
                  text-align: right;
                }

                .product-unit-total-price {
                  width: 12.109375vw;
                  font-size: 1.953125vw;
                  text-align: right;
                }
              }
            }
          }
        }
      }

      .wrap-last-order-history {
        flex: 1;

        .last-order-history-text {
          font-family: "notosans";
          font-size: 1.25vw;
          color: #fff;
          letter-spacing: -0.03125vw;
          border-bottom: solid 0.078125vw #666;
          padding-bottom: 0.78125vw !important;
          box-sizing: border-box;
        }

        .credit-history {
          color: #fff;
        }

        .last-order-history-list {
          margin-top: 1.5625vw !important;
          height: calc(76vh - 19.53125vw);
          display: flex;
          flex-direction: column;
          gap: 1.171875vw;
          overflow: scroll;

          .phone-number {
            color: #fff;
            font-size: 3vw;
            font-weight: bold;
          }

          .last-order-history {
            display: flex;
            flex-direction: column;
            gap: 0.390625vw;

            .last-product-info {
              font-family: 'Spoqa Han Sans Neo', 'sans-serif';
              display: flex;
              justify-content: space-between;
              align-items: center;
              gap: 0.390625vw;

              .last-order-product-name {
                flex: 1;
                font-size: 1.25vw;
                color: #fff;
                letter-spacing: -0.03125vw;
              }

              .last-order-product-quantity {
                text-align: right;
                width: 3.125vw;
                font-size: 1.09375vw;
                letter-spacing: -0.02734375vw;
                color: #fff;
              }
            }
          }
        }
      }
    }

    .wrap-confirm-button {
      width: 100%;
      font-family: 'Spoqa Han Sans Neo', 'sans-serif';
      display: flex;
      align-items: center;
      gap: 3.515625vw;

      .close-button {
        flex: 1;
        height: 4.53125vw;
        margin-left: 3.90625vw !important;
        border: none;
        border-radius: 1.015625vw;
        background-color: #404144;
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        font-size: 2.03125vw;
        font-weight: bold;
        color: #fff;
      }

      .confirm-button {
        display: block;
        width: 37.5vw;
        height: 4.53125vw;
        background-color: #fc0000;
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        font-weight: bold;
        font-size: 2.03125vw;
        color: #fff;
        letter-spacing: -0.05078125vw;
        border: none;
        border-radius: 1.015625vw;
      }

      .confirm-time-message {
        width: 13.28125vw;
        margin-right: 3.125vw !important;
        text-align: right;
        font-weight: bold;
        font-size: 2.109375vw;
        letter-spacing: -0.05078125vw;
        color: #fff;
      }
    }
  }
}
</style>
