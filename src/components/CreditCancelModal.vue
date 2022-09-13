<template lang="pug">
  .credit-cancel-modal-container
    .wrap-credit-cancel-modal
      p.credit-cancel-modal-title 신용카드 결제 취소
      .credit-cancel-modal
        p.card-number 카드번호: {{item.cardNumber}}
        p.card-name 카드사명: {{item.issuer}}
        p.credit-amount 결제금액:
          span(v-if="standardPriceFrontPosition") {{standardPriceUnit}}
          span {{item.amount.toLocaleString()}}
          span(v-if="!standardPriceFrontPosition") {{standardPriceUnit}}
        p.approval-month 할부개월: {{item.ApprovalMonth}}
        p.approval-number 승인번호: {{item.paymentId}}
        p.approval-date 승인일시: {{item.creditDateTime}}
      .confirm-button-list
        button.close-button(@click.stop="closeItemModal()") 닫기
        button.credit-cancel-button(@click.stop="cardCancelCommit(item)") 승인취소
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
    },
    closeItemModal: {
      type: Function
    },
    cardCancelCommit: {
      type: Function
    },
    standardPriceUnit: {
      type: String
    },
    standardPriceFrontPosition: {
      type: Boolean
    }
  }

};
</script>

<style lang="scss" scoped>
.credit-cancel-modal-container {
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

  .wrap-credit-cancel-modal {
    width: 35.9375vw;
    height: 41.640625vw;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 1.5625vw;

    .credit-cancel-modal-title {
      font-size: 1.5625vw;
      letter-spacing: -0.0390625vw;
      padding: 3.125vw 3.125vw 1.5625vw !important;
      border-bottom: solid 0.078125vw #fc0000;
    }

    .credit-cancel-modal {
      display: flex;
      flex-direction: column;
      gap: 1.25vw;
      padding: 1.5625vw 3.125vw 0.78125vw !important;
      box-sizing: border-box;

      > p {
        font-size: 1.875vw;
        letter-spacing: -0.046875vw;
      }
    }

    .confirm-button-list {
      display: flex;
      gap: 0.78125vw;
      padding: 3.125vw !important;
      box-sizing: border-box;

      > button {
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        font-size: 2.03125vw;
        letter-spacing: -0.05078125vw;
        flex: 1;
        height: 4.53125vw;
        border-radius: 1.015625vw;
        border: none;
      }

      .close-button {
        color: #666;
        background-color: #e5e5e5;
      }

      .credit-cancel-button {
        color: #fff;
        background-color: #fc0000;
      }
    }
  }
}

</style>