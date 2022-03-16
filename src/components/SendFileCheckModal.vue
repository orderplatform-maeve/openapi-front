<template lang="pug">
  .send-file-modal-component
    .wrap-send-file-modal
      .wrap-send-file-modal-title
        p.send-file-modal-title 첨부파일 전송
      .wrap-file-information
        p.phone-number {{phoneNumber}}
        p.phone-number-check 입력하신 번호가 맞으신가요?
      .wrap-input-submit-button
        button.cancel(@click="cancelSendFile") 아니오
        button.submit(@click="sendFile(fileList, phoneNumber)") 예
</template>

<script>
export default {
  props: {
    fileList: {
      type: Array,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    sendFile: {
      type: Function,
      required: true,
    },
    cancelSendFile: {
      type: Function,
      required: true,
    }
  },
};
</script>

<style lang="scss" scoped>
.send-file-modal-component {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);

  .wrap-send-file-modal {
    width: 62.265625vw;
    height: 32.03125vw;
    background-color: #fff;
    border-radius: 1.5625vw;
    // padding: 1.5625vw !important;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .wrap-send-file-modal-title {
      border-radius: 1.5625vw 1.5625vw 0 0;
      padding: 30px 19px 20px 30px !important;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: solid 0.15625vw #fc0000;

      .send-file-modal-title {
        font-size: 1.875vw;
        font-weight: bold;
      }

      .send-file-modal-message {
        font-size: 1.40625vw;
        letter-spacing: -0.0703125vw;
        font-weight: bold;

        .red {
          color: #fc0000;
        }
      }
    }

    .wrap-file-information {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 0.78125vw;
      padding: 1.5625vw !important;
      box-sizing: border-box;
      font-size: 2.34375vw;
      font-weight: bold;
    }

    .wrap-input-submit-button {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1.5vw;
      padding: 1.5625vw 0 !important;

      > button {
        width: 14.0625vw;
        height: 4.53125vw;
        font-size: 2.03125vw;
        font-weight: bold;
        letter-spacing: -0.1015625vw;
        border: none;
        border-radius: 1.015625vw;
      }

      .cancel {
        background-color: #e5e5e5;;
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