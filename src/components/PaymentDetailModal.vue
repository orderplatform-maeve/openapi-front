<template lang="pug">
.payment-detail-container
  .payment-detail-wrap
    .detail-modal-title-wrap
      p {{ detailPayData.tabletNumber }}
      div(@click="closeDetailModal")
        big-close-button
    .modal-body-wrap
      .table-row
        .table-head No
        .table-body {{ detailPayData.no }}
        .table-head 결제 일시
        .table-body {{ detailPayData.approvalDatetime }}
      .table-row
        .table-head 테이블 번호
        .table-body {{ detailPayData.tabletNumber }}
        .table-head 주문 접수 상태
        .table-body {{ detailPayData.orderStatus }}
      .table-row
        .table-head 결제 상태
        .table-body {{ detailPayData.paymentStatus }}
        .table-head 주문 일시
        .table-body {{ detailPayData.orderDatetime }}
      .table-row
        .table-head 결제 유형
        .table-body {{ detailPayData.paymentMethod }}
        .table-head 할부 개월
        .table-body {{ detailPayData.approvalMonth }}
      .table-row
        .table-head 결제 금액
        .table-body {{ getAmount(detailPayData.amount) }}
        .table-head 매입사명
        .table-body {{ detailPayData.issuer }}
      .table-row
        .table-head 카드사명
        .table-body {{ detailPayData.acquirer }}
        .table-head 카드번호
        .table-body {{ detailPayData.cardNumber }}
      .table-row(v-if="showCancelDate")
        .table-head 취소 일시
        .table-body {{ detailPayData.cancelApprovalDatetime }}
        .table-head
        .table-body
</template>

<script>
import { BigCloseButton } from '@svg';

export default {
  props: {
    closeDetailModal: {
      type: Function,
    },
    detailPayData: {
      type: Object,
    },
    getAmount: {
      type: Function,
    }
  },
  components: {
    BigCloseButton,
  },
  computed: {
    showCancelDate() {
      return this.detailPayData.paymentStatus === '취소';
    },
  },
};

</script>

<style lang="scss" scoped>
.payment-detail-container {
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

  .payment-detail-wrap {
    width: 92.1875vw;
    height: 54.3750vw;
    padding: 1.5625vw 3.1250vw 3.9063vw 3.1250vw  !important;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 1.5625vw;

    .detail-modal-title-wrap {
      display: flex;
      justify-content: space-between;
      font-size: 3.2813vw;
      font-family: "notosans";
      font-weight: bold;
      letter-spacing: -0.0820vw;
      align-items: center;
      margin-bottom: 1.8750vw !important;
    }

    .modal-body-wrap {
      font-size: 2.1094vw;
      letter-spacing: -0.046875vw;

      .table-row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        padding: 0 !important;
        border-top: 0.0781vw solid #ccc;
        text-align: center;
        height: 5.9375vw;
        line-height: 5.9375vw;

        .table-head {
          width: 19.5313vw;
          background-color: #f2f2f2;
          font-weight: 600;
          letter-spacing: -0.1055vw;
        }

        .table-body {
          width: 23.4375vw;
          letter-spacing: -0.1094vw;
        }
      }

      .table-row:last-child {
        border-bottom: 0.0781vw solid #ccc;
      }
    }
  }
}
</style>