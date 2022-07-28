<template lang="pug">
.order-credit-history-modal-container(@click="closeModal")
  .wrap-close-button
    button.close-button(@click.stop="closeModal") 닫기
  .wrap-order-credit-history-modal(@click.stop)
    p.order-credit-history-modal-title 결제 정보
    .credit-information-list
      .wrap-credit-information-header
        p.credit-information-header 승인 구분
        p.credit-information-header 카드 번호
        p.credit-information-header 매입사
        p.credit-information-header 승인 금액
        p.credit-information-header 승인 번호
        p.credit-information-header 거래 번호
        p.credit-information-header 에러 메세지
      .wrap-credit-information(
        v-for="(creditInformation, index) in creditInformationList"
        :key="index"
      )
        p.credit-information {{creditInformation.approval_type}}
        p.credit-information {{creditInformation.card_number}}
        p.credit-information {{creditInformation.acquirer}}
        p.credit-information {{creditInformation.amount}}
        p.credit-information {{creditInformation.approval_number}}
        p.credit-information {{creditInformation.payment_id}}
        p.credit-information {{creditInformation.error_message}}
</template>

<script>
export default {
  props: {
    creditInformationList: {
      type: Array,
      required: true,
    },
    closeModal: {
      type: Function,
      required: true,
    }
  },
};
</script>

<style lang="scss" scoped>
.order-credit-history-modal-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);

  .wrap-close-button {
    position: absolute;
    top: 1.5625vw;
    right: 1.5625vw;
    display: flex;
    align-items: center;
    justify-content: center;

    .close-button {
      background-color: #fff;
      width: 11.40625vw;
      height: 5vw;
      border: none;
      border-radius: 2.5vw;
      font-family: 'Spoqa Han Sans Neo', 'sans-serif';
      font-size: 2.34375vw;
      font-weight: bold;
      letter-spacing: -0.05859375vw;
      text-align: center;
      color: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.390625vw;
    }

    .close-button::before {
      content: '\00d7';
      font-size: 2.734375vw;
    }
  }

  .wrap-order-credit-history-modal {
    margin-top: 3.125vw !important;
    width: 90vw;
    height: 50vw;
    background-color: #fff;
    border-radius: 1.5625vw;
    box-sizing: border-box;
    .order-credit-history-modal-title {
      border-radius: 1.5625vw 1.5625vw 0 0;
      padding: 2.34375vw 1.484375vw 1.5625vw 2.34375vw !important;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: solid 0.15625vw #fc0000;
      font-family: "notosans";
      font-size: 1.875vw;
      font-weight: bold;
    }

    .credit-information-list {
      display: flex;
      flex-direction: column;

      .wrap-credit-information-header {
        padding: 0.78125vw 2.34375vw !important;
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        align-items: center;
        gap: 0.78125vw;
        border-bottom: solid 0.078125vw #ccc;

        .credit-information-header {
          font-family: 'Spoqa Han Sans Neo', 'sans-serif';
          font-size: 1.71875vw;
          letter-spacing: -0.025em;
          text-align: center;
        }
      }

      .wrap-credit-information {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        align-items: center;
        gap: 0.78125vw;
        padding: 0.78125vw 2.34375vw !important;
        box-sizing: border-box;
        border-bottom: solid 0.078125vw #eee;

        .credit-information  {
          font-family: 'Spoqa Han Sans Neo', 'sans-serif';
          font-size: 1.5625vw;
          letter-spacing: -0.025em;
          text-align: center;
          word-break: break-all;
        }
      }
    }
  }
}
</style>