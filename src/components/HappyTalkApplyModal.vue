<template lang="pug">
.happy-talk-apply-modal-component(@click.self="closeHappyTalkApplyModal")
  happy-talk-confirm-modal(
    v-if="isVisibleConfirmModal"
    :phoneNumber="phoneNumber"
    :yesAction="applyHappyTalk"
    :noAction="closeConfirmModal"
  )
  .wrap-close-button
    button.close-button(@click="closeHappyTalkApplyModal") 닫기
  .wrap-happy-talk-apply-modal
    .wrap-happy-talk-apply-modal-title
      p.happy-talk-apply-modal-title 상담 신청
    .wrap-file-information
      .wrap-happy-talk-apply-message
        .happy-talk-message-header
          p.message 카카오톡 상담을 원하는
          p.message 행드폰 번호를 입력해주세요.
        .wrap-happy-talk-notice-all
          .wrap-happy-talk-notice
            .happy-talk-icon
              number-one
            .happy-talk-message
              p.small-message 입력하신 핸드폰 번호로
              p.small-message 카카오톡 메세지가 발송됩니다.
          .wrap-happy-talk-notice
            .happy-talk-icon
              number-two
            .happy-talk-message
              p.small-message
                span 전달 받으신 메세지에서
                strong  [상담사 연결하기]
                span  버튼을
              p.small-message 누르시면 상담원과 상담이 진행됩니다.
        .wrap-red-notice
          .notice
          .red-notice
            p.message 모든 상담원이 상담 중일 경우 대기시간이
            p.message 발생 할 수 있습니다.
      .wrap-phone-number
        p.phone-number {{phoneNumber}}
        .wrap-input-phone-number
          table.input-phone-number
            tr
              td.number(v-for="number in [1, 2, 3]" :key="number" @click.stop="updatePhoneNumber(number)") {{number}}
            tr
              td.number(v-for="number in [4, 5, 6]" :key="number" @click.stop="updatePhoneNumber(number)") {{number}}
            tr
              td.number(v-for="number in [7, 8, 9]" :key="number" @click.stop="updatePhoneNumber(number)") {{number}}
            tr
              td.reset(@click.stop="updatePhoneNumber('r')") Reset
              td.number(@click.stop="updatePhoneNumber(0)") 0
              td.number(@click.stop="updatePhoneNumber('d')")
                number-delete-button(
                  :width="'2.96875vw'"
                  :height="'2.03125vw'"
                )
    .wrap-input-submit-button
      button.submit(@click="checkPhoneNumber") 상담 신청하기
</template>

<script>
import {
  PaperClip,
  NumberDeleteButton,
  NumberOne,
  NumberTwo
} from '@svg';

import HappyTalkConfirmModal from '@components/HappyTalkConfirmModal.vue';

export default {
  components: {
    PaperClip,
    NumberDeleteButton,
    NumberOne,
    NumberTwo,
    HappyTalkConfirmModal,
  },
  props: {
    phoneNumber: {
      type: String,
      required: true,
    },
    checkPhoneNumber: {
      type:Function,
      required: true,
    },
    updatePhoneNumber: {
      type: Function,
      required: true,
    },
    applyHappyTalk: {
      type: Function,
      required: true,
    },
    closeHappyTalkApplyModal: {
      type: Function,
      required: true,
    },
    isVisibleConfirmModal: {
      type: Boolean,
      required: true,
    },
    openConfirmModal: {
      type: Function,
      required: true,
    },
    closeConfirmModal: {
      type: Function,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.happy-talk-apply-modal-component {
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

  .wrap-happy-talk-apply-modal {
    width: 62.265625vw;
    height: 45.31255vw;
    background-color: #fff;
    border-radius: 1.5625vw;
    // padding: 1.5625vw !important;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;

    .wrap-happy-talk-apply-modal-title {
      border-radius: 1.5625vw 1.5625vw 0 0;
      padding: 30px 19px 20px 30px !important;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: solid 0.15625vw #fc0000;

      .happy-talk-apply-modal-title {
        font-size: 1.875vw;
        font-weight: bold;
      }

      .happy-talk-apply-modal-message {
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

      .wrap-happy-talk-apply-message {
        padding: 2.34375vw !important;
        flex: 1;
        height: 30.234375vw;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 0.78125vw;
        overflow-y: auto;

        .happy-talk-message-header {
          font-family: 'Spoqa Han Sans Neo', 'sans-serif';
          font-size: 1.71875vw;
          letter-spacing: -0.025em;
          font-weight: bold;
        }

        .wrap-happy-talk-notice-all {
          margin-top: 2.34375vw !important;
          display: flex;
          flex-direction: column;
          gap: 0.78125vw;

          .wrap-happy-talk-notice {
            display: flex;
            align-items: flex-start;
            gap: 0.546875vw;

            .happy-talk-message {
              font-family: 'Spoqa Han Sans Neo', 'sans-serif';
              font-size: 1.25vw;
              letter-spacing: -0.05em;
              color: #000;
            }
          }
        }

        .wrap-red-notice {
          margin-top: 3.125vw !important;
          font-size: 1.40625vw;
          letter-spacing: -0.025em;
          color: #fc0000;
          display: flex;
          gap: 0.234375vw;
        }

        .wrap-red-notice::before {
          content: '※'
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
          height: 5.11718750vw;
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

              td:active {
                background-color: #efefef !important;
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
        width: 37.5vw;
        height: 4.53125vw;
        font-size: 2.03125vw;
        font-weight: bold;
        letter-spacing: -0.1015625vw;
        border: none;
        border-radius: 1.015625vw;
      }

      .submit {
        background-color: #fc0000;
        color: #fff;
      }
    }
  }
}
</style>