<template lang="pug">
  .cancel-cash-payment-modal-container
    .wrap-cancel-cash-payment-modal
      p.cancel-cash-payment-modal-title 현금미결제
      p.cancel-cash-payment-message 현금결제 환불 처리하시겠습니까?
      .confirm-button-list
        button.close-button(@click.stop="closeItemModal()") 닫기
        button.credit-cancel-button(@click.stop="cashCancelCommit(item)") 승인취소
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
    cashCancelCommit: {
      type: Function
    }
  }

};
</script>

<style lang="scss" scoped>
.cancel-cash-payment-modal-container {
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

  .wrap-cancel-cash-payment-modal {
    position: relative;
    width: 35.9375vw;
    height: 41.640625vw;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 1.5625vw;

    .cancel-cash-payment-modal-title {
      font-size: 1.5625vw;
      letter-spacing: -0.0390625vw;
      padding: 3.125vw 3.125vw 1.5625vw !important;
      border-bottom: solid 0.078125vw #fc0000;
    }

    .cancel-cash-payment-message {
      padding: 1.5625vw 3.125vw !important;
      font-size: 1.875vw;
      letter-spacing: -0.046875vw;
      box-sizing: border-box;
    }

    .confirm-button-list {
      position: absolute;
      width: 100%;
      bottom: 0;
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