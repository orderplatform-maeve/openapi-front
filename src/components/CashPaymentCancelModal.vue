<template lang="pug">
.cash-payment-cancel-container
  .cash-payment-cancel-modal-wrap
    .modal-title-wrap
      p 현금 결제 취소 요청
    .modal-body-wrap
      .table-wrap
        .table-head 테이블 번호
        .table-body {{ cashPaymentCancelInfo.table.name }}
      .table-wrap
        .table-head 취소 금액
        .table-body
          | {{ amount() }}
          span(v-if="cashPaymentCancelInfo.paymentInfo.count") &nbsp;외 {{ cashPaymentCancelInfo.paymentInfo.count }}건
    .modal-footer-wrap
      button(@click="goPaymentDetailsPage()") 자세히 보기
</template>

<script>
export default {
  props: {
    goPaymentDetailsPage: {
      type: Function,
    }
  },
  computed: {
    cashPaymentCancelInfo() {
      return this.$store.state.cashPaymentCancelInfo;
    },
  },
  methods: {
    amount() {
      if (this.cashPaymentCancelInfo.paymentInfo.amount > 0) {
        return this.cashPaymentCancelInfo.paymentInfo.amount.toLocaleString();
      } return 0;
    }
  },
};
</script>

<style lang="scss" scoped>
.cash-payment-cancel-container {
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
  z-index: 201;

  .cash-payment-cancel-modal-wrap {
    width: 58.28125vw;
    height: 26.5625vw;
    padding: 3.125vw!important;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 1.5625vw;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .modal-title-wrap {
      font-size: 1.8750vw;
      font-weight: bold;
      letter-spacing: -0.0390625vw;
    }

    .modal-body-wrap {
      font-size: 1.875vw;
      letter-spacing: -0.046875vw;

      .table-wrap {
        display: grid;
        grid-template-columns: 1fr 1fr;
        padding: 0 !important;
        border-top: 0.0781vw solid #ccc;
        text-align: center;
        height: 4.6875vw;
        line-height: 4.6875vw;

        .table-head {
          width: 30%;
          background-color: #f2f2f2;
          font-weight: 600;
        }

        .table-body {
          width: 70%;
        }
      }

      .table-wrap:last-child {
        border-bottom: 0.0781vw solid #ccc;
      }
    }
    .modal-footer-wrap {
      display: flex;
      justify-content: center;
      align-items: center;

      > button {
        font-family: "Spoqa Han Sans Neo", "sans-serif";
        font-size: 2.03125vw;
        letter-spacing: -0.05078125vw;
        width: 14.453125vw;
        height: 4.53125vw;
        border-radius: 1.015625vw;
        border: none;
        color: #fff;
        background-color: #fc0000;
      }
    }
  }
}
</style>