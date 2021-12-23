<template lang="pug">
  .serving-robot-back-modal-container
    .serving-robot-back-modal
      .wrap-serving-robot-back-header
        p.serving-guide-header 서빙안내
        icon-exit-black(@click.native="unVisibleModal")
      .wrap-serving-robot-back-message
        p 해당 테이블에 도착한 서빙로봇을 복귀시키시겠어요?
        p 수령 여부를 확인 후 [확인] 버튼을 눌러주세요.
      .wrap-confirm-button
        button.cancel-button(@click="unVisibleModal") 취소
        button.confirm-button(@click="goBackRobot") 확인
</template>

<script>
export default {
  props: {
    unVisibleModal: {
      type: Function,
      required: true,
    },
    goBackRobot: {
      type: Function,
      required: true,
    }
  }
};
</script>

<style lang="scss" scoped>
.serving-robot-back-modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);

  .serving-robot-back-modal {
    width: 50%;
    height: 60%;
    background-color: #fff;
    border-radius: 1.5625vw;
    padding: 1.5625vw !important;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .wrap-serving-robot-back-header {
      padding: 1.5625vw 0 !important;
      box-sizing: border-box;
      font-family: "notosans";
      font-size: 2.734375vw;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .wrap-serving-robot-back-message {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 0.78125vw;
      font-family: "notosans";
      font-size: 1.953125vw;
    }

    .wrap-confirm-button {
      padding: 2.34375vw 0 0 !important;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.78125vw;

      > button {
        width: 12.5vw;
        height: 4.6875vw;
        font-family: "notosans";
        font-size: 2.34375vw;
        border-radius: 0.78125vw;
        background-color: unset;
      }

      .cancel-button {
        border: solid 0.078125vw #000;
      }

      .confirm-button {
        border: none;
        background-color: #fc0000;
        color: #fff;
      }
    }
  }
}
</style>