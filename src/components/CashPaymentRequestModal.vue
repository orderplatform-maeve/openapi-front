<template lang="pug">
.cash-payment-confirm-container
  .cash-payment-confirm-wrap
    .modal-title-wrap
      p.modal-title 현금 결제 요청
    .modal-body-wrap
      div.modal-body-text
        .cash-payment-info {{ cashPaymentRequestInfo.tableName }} 테이블
        .at-text 에서
        .cash-payment-info {{ getAmount(cashPaymentRequestInfo.amount) }}원
      p 현금결제를 요청했습니다.
    .modal-footer-wrap
      button.confirm-button(@click="closeCashPaymentRequestModal") 닫기
</template>

<script>
export default {
  computed: {
    cashPaymentRequestInfo() {
      return this.$store.state.cashPaymentRequestInfo;
    },
  },
  methods: {
    closeCashPaymentRequestModal() {
      this.$store.commit('updateCashPaymentRequestModal', false);
    },
    getAmount(amount) {
      return amount ? amount?.toLocaleString() : 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.cash-payment-confirm-container {
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
  z-index: 1000;

  .cash-payment-confirm-wrap {
    width: 50vw;
    height: 28vw;
    padding: 2.125vw 0 !important;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 1.5625vw;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .modal-title-wrap {
      font-size: 2.1875vw;
      font-weight: bold;
      letter-spacing: -0.0390625vw;
      padding-bottom: 1.5625vw !important;
      border-bottom: 0.0781vw solid #fc0000;

      .modal-title {
        display: flex;
        justify-content: center;
      }
    }


    .cash-payment-info {
      font-size: 2.1875vw;
      font-weight: bold;
      padding-bottom: 1.5vw !important;
      color: #fc0000;
    }

    .modal-body-wrap {
      padding: 0 3.125vw !important;
      font-size: 2vw;
      letter-spacing: -0.046875vw;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;

      .modal-body-text {
        display: flex;
        gap: .3125vw;

        .at-text {
          padding-top: .1563vw !important;
        }
      }

    }

    .modal-footer-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.78125vw;

      > button {
        font-family: "Spoqa Han Sans Neo", "sans-serif";
        font-size: 2.03125vw;
        letter-spacing: -0.05078125vw;
        width: 14.453125vw;
        height: 4.53125vw;
        border-radius: 1.015625vw;
        border: none;
        color: #666;
        background-color: #e5e5e5;
      }

      .confirm-button {
        color: #fff;
        background-color: #fc0000;
      }
    }
  }
}
</style>