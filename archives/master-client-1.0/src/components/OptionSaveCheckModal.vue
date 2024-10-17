<template lang="pug">
.option-save-check-modal-container
  .wrap-option-save-check-modal
    p.option-save-check-modal-title 조심해요!!
    .option-save-check-modal-body
      p.option-save-check-modal-body-message 필수 옵션에서 선택할 수 있는 옵션이 없으면
      p.option-save-check-modal-body-message {{goodsName}} 주문을 받을 수 없습니다.
    .option-save-check-modal-footer
      button.option-save-check-modal-button-commit(@click="changedOptionSaveConfirmAndSubmit") 확인
      button.option-save-check-modal-button-close(@click="changedOptionSaveCancel") 취소
</template>

<script>
export default {
  props: {
    changedOptionSaveConfirmAndSubmit: {
      type: Function
    },
    changedOptionSaveCancel: {
      type: Function
    },
    goodsName: {
      type: String
    },
  },
};

</script>

<style lang="scss" scoped>
.option-save-check-modal-container {
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

  .wrap-option-save-check-modal {
    width: 80%;
    padding: 0 1.875vw !important;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 3.125vw;

    .option-save-check-modal-title {
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

    .option-save-check-modal-body {
      font-family: 'Spoqa Han Sans Neo', 'sans-serif';
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 1.5625vw;
      padding: 1.875vw !important;
      box-sizing: border-box;
      border-radius: 1.875vw;
      background-color: rgb(255, 0, 0, 0.8);

      .option-save-check-modal-body-title {
        font-size: 5vw;
        font-weight: bold;
        word-break: keep-all;
      }

      .option-save-check-modal-body-message {
        font-size: 3.125vw;
        font-weight: 500;
        word-break: keep-all;
      }

      .option-save-check-modal-body-sub-message {
        font-size: 2.125vw;
        font-weight: lighter;
        word-break: keep-all;
      }
    }

    .option-save-check-modal-footer {
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
        box-shadow: 0 0 0.6250vw -0.3125vw #000000;
      }

      .option-save-check-modal-button-commit {
        background-color: #ff0000;
        color: #fff;
      }

      .option-save-check-modal-button-close {
        background-color: #ffffff;
        color: #202020;
      }
    }
  }
}

</style>
