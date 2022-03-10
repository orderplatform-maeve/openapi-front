<template lang="pug">
  .send-file-modal-component
    .wrap-send-file-modal
      .wrap-send-file-modal-title
        p.send-file-modal-title 첨부파일 전송
        p.send-file-modal-message
          span 해당번호의
          span.red  카카오 알림톡
          span 으로 첨부파일을 보내드립니다.
      .wrap-file-information
        .wrap-send-file-list
          p.send-file-list-title 첨부파일(총 {{getFileQuantity}}개)
          .notice-file(
            v-for="(file, index) in fileList"
            :key="`file-key-${index}`"
          )
            paper-clip(
              :width="'1.5625vw'"
              :height="'1.640625vw'"
            )
            p.file-info {{getFileName(file)}} ({{getFileSize(file)}}MB)
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
                  number-delete-button(
                    :width="'2.96875vw'"
                    :height="'2.03125vw'"
                  )
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
  methods: {
    getFileName(file) {
      return file?.fileName;
    },
    getFileSize(file) {
      return file?.fileSize;
    }
  },
  computed: {
    getFileQuantity() {
      const fileList = this.fileList;

      return fileList.length;
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
    height: 45.31255vw;
    background-color: #fff;
    border-radius: 1.5625vw;
    // padding: 1.5625vw !important;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;

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
      display: flex;
      border-bottom: solid 0.078125vw #ccc;

      .wrap-send-file-list {
        padding: 2.34375vw !important;
        flex: 1;
        height: 30.234375vw;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 0.78125vw;
        overflow-y: auto;

        .send-file-list-title {
          font-size: 1.25vw;
          letter-spacing: -0.0625vw;
          font-weight: bold;
          margin-bottom: 0.78125vw !important;
        }

        .notice-file {
          display: flex;
          gap: 0.78125vw;

          .file-info {
            flex: 1;
            font-size: 1.09375vw;
            border: none;
            border-radius: 5px;
          }
        }
      }

      .wrap-phone-number {
        padding: 2.34375vw 2.34375vw 1.5625vw !important;
        border-left: solid 0.078125vw #ccc;
        box-sizing: border-box;

        .phone-number {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 2.96875vw;
          font-weight: bold;
          letter-spacing: -0.1484375vw;
          color: #000;
          width: 25.625vw;
          box-sizing: border-box;
          padding-bottom: 0.7421875vw !important;
          border-bottom: 0.078125vw solid #000;
        }

        .wrap-input-phone-number {
          margin-top: 1.484375vw !important;
          display: flex;
          justify-content: center;
          .input-phone-number {
            color: #000;
            border-collapse: collapse;
            box-sizing: border-box;
            margin-top: 0.78125vw !important;

            tr {
              box-sizing: border-box;
              border-top: solid 0.078125vw #ccc;

              td {
                width: 8.4375vw;
                height: 5vw;
                font-size: 2.5vw;
                letter-spacing: -0.0546875vw;
                background-color: unset;
                box-sizing: border-box;
                text-align: center;
                padding: 0;
                border-left: solid 0.078125vw #ccc;
              }

              .reset {
                font-size: 1.875vw;
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
      }
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