<template lang="pug">
.cash-check-or-cancel-container
  .check-or-cancel-wrap(v-if="showCashType")
    .modal-title-wrap
      span 현금 수금 확인 요청
    .modal-body-wrap
      .table-wrap
        .table-head 테이블 번호
        .table-body {{ detailPayData.tabletNumber }}
      .table-wrap
        .table-head 결제 금액
        .table-body {{ getAmount(detailPayData.amount) }}
      .table-wrap
        .table-head 결제 일시
        .table-body {{ detailPayData.approvalDatetime }}
    span.confirm-text 해당 테이블에서 현금 수금이 확인되었습니까?
    .modal-footer-wrap
      button(@click="closePayCheckModal()") 취소
      button.confirm-button(@click="cashCommit()") 완료
  .check-or-cancel-wrap(v-else)
    .modal-title-wrap
      span 현금 결제 취소 요청
    .modal-body-wrap
      .table-wrap
        .table-head 테이블 번호
        .table-body {{ detailPayData.tabletNumber }}
      .table-wrap
        .table-head 결제 금액
        .table-body {{ getAmount(detailPayData.amount) }}
      .table-wrap
        .table-head 결제 일시
        .table-body {{ detailPayData.approvalDatetime }}
      .table-wrap
        .table-head 주문 일시
        .table-body {{ detailPayData.orderDatetime }}
    span.confirm-text 해당 테이블에 환불처리 하셨습니까?
    .modal-footer-wrap
      button(@click="closePayCheckModal()") 취소
      button.confirm-button(@click="cashCancelCommit()") 완료

</template>

<script>
export default {
  props: {
    cashType: {
      type: String,
    },
    closePayCheckModal: {
      type: Function,
    },
    detailPayData: {
      type: Object,
    },
    cashCommit: {
      type: Function,
    },
    cashCancelCommit: {
      type: Function,
    },
    getAmount: {
      type: Function,
    }
  },
  computed: {
    showCashType() {
      return this.cashType === 'CHECK' ? true : false;
    }
  },
};
</script>

<style lang="scss" scoped>
.cash-check-or-cancel-container {
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

  .check-or-cancel-wrap {
    width: 58.28125vw;
    height: 41.640625vw;
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

      > span {
        margin-left: 3.125vw !important;
      }
    }

    .modal-body-wrap {
      padding: 0 3.125vw !important;
      font-size: 1.7188vw;
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
    .confirm-text {
      font-size: 2.03125vw;
      font-weight: bold;
      color: #fc0000;
      text-align: center;
      letter-spacing: -0.05078125vw;
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