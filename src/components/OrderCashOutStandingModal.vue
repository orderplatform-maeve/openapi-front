<template lang="pug">
.cash-out-standing-container
  .wrap-cash-out-standing
    p.cash-out-standing-title 현금미결제
    .cash-out-standing
      .credit-information
        p.wrap-order-price 주문금액:
          span.order-price  {{item.orderPrice.toLocaleString()}}원
        p.approval-number 주문번호: {{item.order_id}}
        p.order-date 주문일시: {{item.order_time}}
      .order-information-list
        .order-information(
          v-for="(order, index) in item.order_info"
          :key="getOrderInformationKey(order, index)"
        )
          .wrap-order-product-name
            p.order-product-name {{order.display_name}}
            p.order-product-quantity {{order.good_qty}}개
          .order-product-option-list(v-if="order.option")
            p.order-product-option(
              v-for="(option, index) in order.option"
              :key="getOrderProductOptionKey(option, index)") {{option.display_name}}
    .caution-message
      p 테이블에서
      p 현금 수납이 확인되었습니까?
    .confirm-button-list
      button.close-button(@click.stop="closeItemModal()") 닫기
      button.confirm-button(@click.stop="cashCommit") 확인
</template>

<script>
export default {
  name: "OrderCashOutStandingModal",
  props: {
    item: {
      type: Object,
    },
    closeItemModal: {
      type: Function
    },
    cashCommit: {
      type: Function
    }
  },
  methods: {
    getOrderInformationKey(order, index) {
      return `order-${order.display_name}-index-${index}`;
    },
    getOrderProductOptionKey(option, index) {
      return `option-${option.display_name}-index-${index}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.cash-out-standing-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  font-family: 'Spoqa Han Sans Neo', 'sans-serif';
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 1;

  // 흰색 배경 백업
  // .wrap-cash-out-standing {
  //   width: 58.28125vw;
  //   height: 41.640625vw;
  //   background-color: #fff;
  //   box-sizing: border-box;
  //   border-radius: 1.5625vw;

  //   .cash-out-standing-title  {
  //     font-size: 1.5625vw;
  //     letter-spacing: -0.0390625vw;
  //     padding: 3.125vw 3.125vw 1.5625vw !important;
  //     border-bottom: solid 0.078125vw #fc0000;
  //   }

  //   .cash-out-standing {
  //     padding: 0 3.125vw !important;
  //     box-sizing: border-box;
  //     display: flex;
  //     justify-content: space-between;

  //     .credit-information {
  //       width: 32.03125vw;
  //       padding-right: 2.34375vw !important;
  //       margin: 1.5625vw 0 !important;
  //       font-size: 1.875vw;
  //       letter-spacing: -0.046875vw;
  //       box-sizing: border-box;
  //       display: flex;
  //       flex-direction: column;
  //       gap: 1.25vw;
  //       border-right: solid 0.078125vw #ccc;

  //       .wrap-order-price {
  //         .order-price {
  //           font-weight: bold;
  //         }
  //       }

  //       .approval-number {
  //         word-break: break-all;
  //       }
  //     }

  //     .order-information-list {
  //       flex: 1;
  //       height: 14.0625vw;
  //       padding-left: 2.34375vw !important;
  //       margin: 1.5625vw 0 !important;
  //       box-sizing: border-box;
  //       display: flex;
  //       flex-direction: column;
  //       gap: 1.5625vw;
  //       overflow: auto;

  //       .order-information {
  //         .wrap-order-product-name {
  //           font-size: 1.5625vw;
  //           letter-spacing: -0.0390625vw;
  //           display: flex;
  //           justify-content: space-between;
  //           align-items: center;

  //           .order-product-name {
  //             font-weight: bold;
  //           }

  //           .order-product-quantity {
  //             color: #666;
  //           }
  //         }

  //         .order-product-option-list {
  //           font-size: 1.25vw;
  //           letter-spacing: -0.03125vw;
  //           color: #666;
  //         }
  //       }
  //     }
  //   }

  //   .caution-message {
  //     font-size: 2.03125vw;
  //     font-weight: bold;
  //     color: #fc0000;
  //     text-align: center;
  //     letter-spacing: -0.05078125vw;
  //   }

  //   .confirm-button-list {
  //     display: flex;
  //     justify-content: center;
  //     gap: 0.78125vw;
  //     padding: 3.90625vw 3.125vw 3.125vw !important;
  //     box-sizing: border-box;

  //     > button {
  //       font-family: 'Spoqa Han Sans Neo', 'sans-serif';
  //       font-size: 2.03125vw;
  //       letter-spacing: -0.05078125vw;
  //       width: 14.453125vw;
  //       height: 4.53125vw;
  //       border-radius: 1.015625vw;
  //       border: none;
  //     }

  //     .close-button {
  //       color: #666;
  //       background-color: #e5e5e5;
  //     }

  //     .confirm-button {
  //       color: #fff;
  //       background-color: #fc0000;
  //     }
  //   }
  // }

    .wrap-cash-out-standing {
      width: 58.28125vw;
      height: 41.640625vw;
      background-color: #111;
      box-sizing: border-box;
      border-radius: 1.5625vw;
      border: solid 0.15625vw #666;

      .cash-out-standing-title  {
        font-size: 1.796875vw;
        color: #fff;
        letter-spacing: -0.025em;
        padding: 3.125vw 3.125vw 1.5625vw !important;
        border-bottom: solid 0.078125vw #fc0000;
      }

      .cash-out-standing {
        padding: 0 3.125vw !important;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;

        .credit-information {
          width: 32.03125vw;
          padding-right: 2.34375vw !important;
          margin: 1.5625vw 0 !important;
          font-size: 1.953125vw;
          letter-spacing: -0.046875vw;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 1.25vw;
          border-right: solid 0.078125vw #ccc;

          .wrap-order-price {
            color: #fff;
            .order-price {
              font-weight: bold;
            }
          }

          .approval-number {
            color: #fff;
            word-break: break-all;
          }

          .order-date {
            color: #fff;
          }
        }

        .order-information-list {
          flex: 1;
          height: 14.0625vw;
          padding-left: 2.34375vw !important;
          margin: 1.5625vw 0 !important;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 1.5625vw;
          overflow: auto;
          color: #fff;

          .order-information {
            .wrap-order-product-name {
              font-size: 1.5625vw;
              letter-spacing: -0.0390625vw;
              display: flex;
              justify-content: space-between;
              align-items: center;

              .order-product-name {
                font-weight: bold;
              }

              .order-product-quantity {
                color: #aaa;
              }
            }

            .order-product-option-list {
              font-size: 1.25vw;
              letter-spacing: -0.03125vw;
              color: #666;
            }
          }
        }
      }

      .caution-message {
        font-size: 2.03125vw;
        font-weight: bold;
        color: #fc0000;
        text-align: center;
        letter-spacing: -0.05078125vw;
      }

      .confirm-button-list {
        display: flex;
        justify-content: center;
        gap: 0.78125vw;
        padding: 3.90625vw 3.125vw 3.125vw !important;
        box-sizing: border-box;

        > button {
          font-family: 'Spoqa Han Sans Neo', 'sans-serif';
          font-size: 2.03125vw;
          letter-spacing: -0.05078125vw;
          width: 14.453125vw;
          height: 4.53125vw;
          border-radius: 1.015625vw;
          border: none;
        }

        .close-button {
          color: #000;
          background-color: #fff;
        }

        .confirm-button {
          color: #fff;
          background-color: #fc0000;
        }
      }
    }
}

</style>