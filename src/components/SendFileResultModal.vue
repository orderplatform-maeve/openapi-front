<template lang="pug">
  .send-file-result-modal-container(@click="fileResultModalCountClose")
    .send-file-result-modal
      .wrap-send-file-result-modal-title
        p.send-file-result-modal-title 첨부파일 전송
        p.send-file-result-modal-timeout
          span.red {{fileResultModalCount}}
          span 초 후에 닫힙니다.
      .wrap-send-file-result-modal-contents
        .wrap-phone-number
          p.phone-number
            span.bold {{phoneNumber}}
            span  번호로
          p.send-message 파일 전송 요청이 완료되었습니다.
        .wrap-alarm-message
          p.alarm-message 카카오 알림톡을 확인해주세요.
          p.alarm-message 첨부파일 용량에 따라 최대 10분이 소요됩니다.
</template>

<script>
export default {
  props: {
    fileResultModalCount: {
      type: Number,
      require: true,
    },
    fileResultModalCountClose: {
      type: Function,
      require: true,
    },
    phoneNumber: {
      type: String,
      require: true,
    },
    startSendFileResultInterval: {
      type: Function,
      require: true,
    }
  },
  mounted() {
    this.startSendFileResultInterval();
  },
  beforeDestroy() {
    this.fileResultModalCountClose();
  }
};
</script>

<style lang="scss" scoped>
.send-file-result-modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Spoqa Han Sans Neo', 'sans-serif';

  .send-file-result-modal {
    width: 62.265625vw;
    height: 32.03125vw;
    background-color: #fff;
    border-radius: 1.5625vw;
    display: flex;
    flex-direction: column;

    .wrap-send-file-result-modal-title {
      padding: 2.34375vw 2.34375vw 1.5625vw !important;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: solid 0.15625vw #fc0000;

      .send-file-result-modal-title {
        font-size: 1.875vw;
        font-weight: bold;
        color: #000;
      }

      .send-file-result-modal-timeout {
        font-size: 1.40625vw;
        font-weight: bold;
        letter-spacing: -0.0703125vw;

        .red {
          color: #fc0000;
        }
      }
    }

    .wrap-send-file-result-modal-contents {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 1.5625vw;

      .wrap-phone-number {
        font-size: 2.34375vw;
        text-align: center;

        .phone-number {
          line-height: 1.67;
          .bold {
            font-weight: bold;
          }
        }
      }

      .wrap-alarm-message {
        background-color: #eff0f2;
        width: 46.09375vw;
        height: 9.453125vw;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 0.78125vw;

        .alarm-message {
          font-size: 1.5625vw;
          line-height: 1.8;
          letter-spacing: -0.078125vw;
        }
      }
    }
  }
}
</style>