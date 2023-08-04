<template lang="pug">
.payment-detail-container
  .order-force-confirm-container(v-if="isForceConfirm")
    .confirm-wrap
      .confirm-body-wrap
        p 마스터로 주문을 강제 취소하더라도
        p 포스에 접수된 해당 주문은 취소되지 않습니다.
        br
        p 주문을 강제 취소하시겠습니까?
      .confirm-bottom-wrap
        button.confirm-button.close(@click="closeForceConfirm()") 아니오
        button.confirm-button(
          @click="clickYesButton()"
        ) 예
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
        .table-body {{ detailPayData.issuer }}
        .table-head 카드번호
        .table-body {{ detailPayData.cardNumber }}
      .table-row(v-if="showCancelDate")
        .table-head 취소 일시
        .table-body {{ detailPayData.cancelApprovalDatetime }}
        .table-head
        .table-body
    .bottom-button-wrap
      button.force-cancel-button(
        v-if="showOrderForceCancelButton"
        @click="openForceConfirm()"
      ) 주문 강제 취소
</template>

<script>
import { BigCloseButton } from '@svg';

export default {
  data() {
    return {
      isForceConfirm: false,
    };
  },
  props: {
    closeDetailModal: {
      type: Function,
    },
    detailPayData: {
      type: Object,
    },
    getAmount: {
      type: Function,
    },
    clickAndroidCallOrderForceCancel: {
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
    showOrderForceCancelButton() {
      return this.detailPayData.status === 3; // 성공한 주문에 대한 결제취소 요청
    }
  },
  methods: {
    openForceConfirm() {
      this.isForceConfirm = true;
    },
    closeForceConfirm() {
      this.isForceConfirm = false;
    },
    clickYesButton() {
      this.clickAndroidCallOrderForceCancel(this.detailPayData.orderKey);
      this.closeForceConfirm();
      this.closeDetailModal();
    }
  }
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

  .order-force-confirm-container {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.85);
    display: flex;
    justify-content: center;
    align-items: center;

    .confirm-wrap {
      width: 640px;
      height: 400px;
      border-radius: 0.6250vw;
      background-color: white;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .confirm-body-wrap {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: calc(100% - 100px);
        font-size: 30px;
        line-height: 1.5;
        padding: 10px !important;
        box-sizing: border-box;
      }

      .confirm-bottom-wrap {
        height: 100px;
        display: flex;
        justify-content: center;
        gap: 30px;
        align-items: center;

        .confirm-button {
          border: none;
          width: 18.7500vw;
          height: 4.6875vw;
          background-color: #fc0000;
          font-size: 2.0313vw;
          color:#fff;
          border-radius: 1.015625vw;
        }

        .close {
          background-color: #fff;
          border: 1px solid #000;
          color: #000;
        }

      }
    }
  }


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
      height: 4.8438vw;
    }

    .modal-body-wrap {
      font-size: 2.1094vw;
      letter-spacing: -0.046875vw;
      display: flex;
      flex-direction: column;
      height: calc(54.375vw - 12.1875vw);
      justify-content: center;

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

    .bottom-button-wrap {
      display: flex;
      justify-content: center;

      .force-cancel-button {
        border: none;
        width: 18.7500vw;
        height: 4.6875vw;
        background-color: #fc0000;
        font-size: 2.0313vw;
        color:#fff;
        border-radius: 1.015625vw;
        margin-top: -1.7969vw;
      }
    }
  }
}
</style>