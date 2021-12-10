<template lang="pug">
  .serving-robot-cancel-modal-container
    .serving-robot-cancel-modal
      .wrap-serving-robot-cancel-header
        p.serving-guide-header 서빙안내
        icon-exit-black
      .wrap-serving-robot-cancel-message
        p 김동주 테이블의 진행중인 서빙을 취소하시겠습니까?
        p 취소 시, 대기 장소로 서빙로봇이 이동합니다.
      .wrap-confirm-button
        button.cancel-button 취소
        button.confirm-button 확인
</template>

<script>
export default {

};
</script>

<style lang="scss" scoped>
.serving-robot-cancel-modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);

  .serving-robot-cancel-modal {
    width: 50%;
    height: 60%;
    background-color: #fff;
    border-radius: 1.5625vw;
    padding: 1.5625vw !important;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .wrap-serving-robot-cancel-header {
      padding: 1.5625vw 0 !important;
      box-sizing: border-box;
      font-family: "notosans";
      font-size: 2.734375vw;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .wrap-serving-robot-cancel-message {
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