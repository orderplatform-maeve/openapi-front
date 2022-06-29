<template lang="pug">
.move-serving-robot-confirm-modal-component(@click.self="cancel")
  .wrap-close-button
    button.close-button(@click="cancel") 닫기
  .wrap-move-serving-robot-confirm-modal
    .wrap-move-serving-robot-confirm-modal-title
      p.move-serving-robot-confirm-modal-title 안내
    .wrap-move-serving-robot-confirm-modal-contents
      p.move-serving-robot-confirm-modal-contents {{destination}}에 도착한 서빙로봇을 대기장소로 복귀시키겠어요?
    .wrap-input-submit-button
      button.close(@click="cancel") 취소
      button.submit(@click="confirm") 확인
</template>

<script>
export default {
  props: {
    destination: {
      type: String,
      required: true,
    },
    confirm: {
      type: Function,
      required: true,
    },
    cancel: {
      type: Function,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.move-serving-robot-confirm-modal-component {
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

  .wrap-move-serving-robot-confirm-modal {
    width: 50vw;
    height: 30.078125vw;
    background-color: #fff;
    border-radius: 1.5625vw;
    // padding: 1.5625vw !important;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .wrap-move-serving-robot-confirm-modal-title {
      border-radius: 1.5625vw 1.5625vw 0 0;
      padding: 2.34375vw 3.125vw 1.5625vw 3.125vw !important;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: solid 0.15625vw #fc0000;

      .move-serving-robot-confirm-modal-title {
        font-size: 1.875vw;
        font-weight: bold;
      }

      .move-serving-robot-confirm-modal-message {
        font-size: 1.40625vw;
        letter-spacing: -0.0703125vw;
        font-weight: bold;

        .red {
          color: #fc0000;
        }
      }
    }

    .wrap-move-serving-robot-confirm-modal-contents {
      padding: 1.5625vw 3.125vw !important;

      .move-serving-robot-confirm-modal-contents {
        font-size: 1.875vw;
        line-height: 1.42;
        letter-spacing: -0.02em;
        color: #000;
      }
    }

    .wrap-input-submit-button {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      gap: 1.5vw;
      padding: 0 3.125vw 3.125vw !important;

      > button {
        width: 14.453125vw;
        height: 4.53125vw;
        font-size: 2.03125vw;
        font-weight: bold;
        letter-spacing: -0.1015625vw;
        border: none;
        border-radius: 1.015625vw;
      }

      .close {
        background-color: #e5e5e5;
        color: #666;
      }

      .submit {
        background-color: #000;
        color: #fff;
      }
    }
  }
}
</style>