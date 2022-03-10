<template lang="pug">
  .send-file-modal-component
    .wrap-send-file-modal
      p.send-file-modal-title 첨부파일 전송
      .wrap-send-file-list
        p.send-file-list-title 해당번호의 카카오 알림톡으로 첨부파일을 보내드립니다.
        .notice-file
          paper-clip
          p.file-info {{getFileName}}
      .wrap-phone-number
        p.phone-number {{phoneNumber}}
      .wrap-input-phone-number
        table.input-phone-number
          tr
            td.number(v-for="number in [1, 2, 3]" :key="number" @click="updatePhoneNumber(number)") {{number}}
          tr
            td.number(v-for="number in [4, 5, 6]" :key="number" @click="updatePhoneNumber(number)") {{number}}
          tr
            td.number(v-for="number in [7, 8, 9]" :key="number" @click="updatePhoneNumber(number)") {{number}}
          tr
            td.reset(@click="updatePhoneNumber('r')") Reset
            td.number(@click="updatePhoneNumber(0)") 0
            td.number(@click="updatePhoneNumber('d')")
              number-delete-button
      .wrap-input-submit-button
        button.cancel(@click="cancelSendFile") 취소
        button.submit(@click="sendFile(fileList, phoneNumber)") 전송하기
</template>

<script>
import {
  PaperClip,
  NumberDeleteButton,
} from '@svg';

export default {
  components: {
    PaperClip,
    NumberDeleteButton
  },
  props: {
    fileList: {
      type: Array,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    updatePhoneNumber: {
      type: Function,
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
  computed: {
    getFileName() {
      const fileList = this.fileList;

      if (fileList.length > 1) {
        return `${fileList[0].fileName} (${fileList[0].fileSize}MB) 외 ${fileList.length - 1}건`;
      }
      return `${fileList[0].fileName} (${fileList[0].fileSize}MB)`;
    },
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
    width: 37vw;
    height: 76vh;
    background-color: #fff;
    border-radius: 1.5625vw;
    // padding: 1.5625vw !important;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;

    .send-file-modal-title {
      display: flex;
      align-items: center;
      padding: 1.25vw 1.5625vw !important;
      font-family: "Spoqa Han Sans Neo", "sans-serif";
      font-size: 1.953125vw;
      font-weight: bold;
      background-color: #aaa;
      border-radius: 1.5625vw 1.5625vw 0 0;
    }

    .wrap-send-file-list {
      padding: 1.25vw 1.5625vw !important;

      .send-file-list-title {
        font-size: 1.4vw;
      }

      .notice-file {
        display: flex;
        gap: 0.78125vw;
        padding: 0.8vw 0 !important;
        align-items: center;

        .file-info {
          font-size: 1vw;
          letter-spacing: -0.7px;
          cursor: pointer;
          border: none;
          border-radius: 5px;
        }
      }
    }

    .wrap-phone-number {
      padding: 0 6vw !important;
      .phone-number {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2.4vw;
        font-weight: 500;
        letter-spacing: -.07421875vw;
        color: #000;
        height: 7.887323944vh;
        border-bottom: 0.0781vw solid #000;
        box-sizing: border-box;
      }
    }

    .wrap-input-phone-number {
      margin-top: 1.25vw !important;
      padding: 0 6vw !important;
      display: flex;
      justify-content: center;
      .input-phone-number {
        color: #000;
        border-collapse: collapse;
        box-sizing: border-box;
        margin-top: 0.78125vw !important;

        tr {
          box-sizing: border-box;
          border-top: solid 2px #f0f0f0;

          td {
            width: 7.7vw;
            height: 8.7vh;
            font-family: "notosans";
            font-size: 1.65vw;
            letter-spacing: -0.078125vw;
            background-color: unset;
            box-sizing: border-box;
            text-align: center;
            padding: 0;
            border-left: solid 2px #f0f0f0;
          }

          .reset {
            font-size: 1.5vw;
            letter-spacing: -0.0625vw;
          }

          td:first-child {
            border-left: none;
          }
        }

        tr:first-child {
          border-top: none;
        }
      }
    }

    .wrap-input-submit-button {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1.5vw;
      margin-top: 1.25vw !important;

      > button {
        width: 8vw;
        height: 2.96875vw;
        font-size: 1.25vw;
        font-weight: bold;
        color: #fff;
        letter-spacing: -0.7px;
        cursor: pointer;
        background-color: #2f2f39;
        border: none;
        border-radius: 5px;
      }

      .submit {
        background-color: #aaa;
      }
    }
  }
}
</style>