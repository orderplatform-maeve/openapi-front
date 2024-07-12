<template lang="pug">
.pos-error-modal-container
  .wrap-pos-error-modal
    p.pos-error-modal-title 조심해요!!
    .pos-error-modal-body
      p.pos-error-modal-body-title 필수 옵션에서 선택할 수 있는 옵션이 없으면
      p.pos-error-modal-body-title {{ productName }} 주문을 받을 수 없습니다.
    .pos-error-modal-footer
      button.pos-error-modal-button-commit(@click="updateSoldOutStatus()") 확인
      button.pos-error-modal-button-close(@click="closeAlertModal()") 닫기
</template>

<script>
export default {
  props: {
    productName: {
      type: String,
      default: '',
    },
    updateSoldOutStatus: {
      type: Function,
    },
    closeAlertModal: {
      type: Function,
    }
  },
};

</script>

<style lang="scss" scoped>
.pos-error-modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.8);
  z-index: 201;
  display: flex;
  justify-content: center;
  align-items: center;

  .wrap-pos-error-modal {
    width: 80%;
    padding: 0 1.875vw !important;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 3.125vw;

    .pos-error-modal-title {
      text-align: center;
      font-family: 'Spoqa Han Sans Neo', 'sans-serif';
      font-size: 1.875vw;
      font-weight: bold;
      color: #fff;
      background-color: rgb(255, 0, 0, 0.7);
      padding: 1.875vw !important;
      box-sizing: border-box;
      border-radius: 1.875vw;
    }

    .pos-error-modal-body {
      font-family: 'Spoqa Han Sans Neo', 'sans-serif';
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 1.875vw !important;
      box-sizing: border-box;
      border-radius: 1.875vw;
      background-color: rgb(255, 0, 0, 0.8);

      .pos-error-modal-body-title {
        font-size: 3.125vw;
        font-weight: 700;
        line-height: normal;
        letter-spacing: -0.078125vw;
        text-align: center;
      }

      .pos-error-modal-body-message {
        font-size: 3.125vw;
        font-weight: lighter;
        word-break: keep-all;
      }

      .pos-error-modal-body-sub-message {
        font-size: 2.125vw;
        font-weight: lighter;
        word-break: keep-all;
      }
    }

    .pos-error-modal-footer {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1.5625vw;
      padding: 1.875vw !important;
      box-sizing: border-box;
      border-radius: 1.875vw;
      background-color: rgb(255, 0, 0, 0.8);

      > button {
        flex: 1;
        height: 6.25vw;
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        font-size: 1.875vw;
        border-radius: 7.8125vw;
        border: none;
        box-shadow: 0 0 8px -4px #000000;
      }

      .pos-error-modal-button-commit {
        background-color: #ff0000;
        color: #fff;
      }

      .pos-error-modal-button-close {
        background-color: #ffffff;
        color: #202020;
      }
    }
  }
}

</style>
