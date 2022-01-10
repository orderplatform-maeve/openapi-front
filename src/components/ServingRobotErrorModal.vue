<template lang="pug">
  .serving-robot-error-modal-container
    .serving-robot-error-modal
      .wrap-serving-robot-error-header
        p.serving-guide-header 로봇 상태 확인
          span(v-if="getRobotName")  ({{getRobotName}})
        icon-exit-black(@click.native="unVisibleModal")
      .wrap-serving-robot-error-message
        p 에러내용: &nbsp;
          span(v-html="getErrorMessage")
      .wrap-confirm-button(@click="unVisibleModal")
        button.confirm-button 확인
</template>

<script>
export default {
  props: {
    errorRobotStatus: {
      type: Object,
      required: true,
    },
    unVisibleModal: {
      type: Function,
      required: true,
    }
  },
  computed: {
    getRobotName() {
      return this.errorRobotStatus.name;
    },
    getErrorMessage() {
      return this.errorRobotStatus.message;
    }
  }
};
</script>

<style lang="scss" scoped>
.serving-robot-error-modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);

  .serving-robot-error-modal {
    width: 50%;
    height: 60%;
    background-color: #fff;
    border-radius: 1.5625vw;
    padding: 1.5625vw !important;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .wrap-serving-robot-error-header {
      padding: 1.5625vw 0 !important;
      box-sizing: border-box;
      font-family: "notosans";
      font-size: 2.734375vw;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .wrap-serving-robot-error-message {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 0.78125vw;
      font-family: "notosans";
      font-size: 1.953125vw;

      .last {
        margin-top: 2.34375vw !important;
      }
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