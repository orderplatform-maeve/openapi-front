<template lang="pug">
.happy-talk-confirm-modal-container
  .wrap-confirm-message
    p.phone-number {{phoneNumber}}
    p.confirm-message 입력하신 번호가 맞으신가요?
  .wrap-action-button
    button.no-button(@click="noAction") 아니요
    button.yes-button(@click="yesAction") 예
</template>

<script>
export default {
  props: {
    phoneNumber: {
      type: String,
      required: true,
    },
    yesAction: {
      type: Function,
      required: true,
    },
    noAction: {
      type: Function,
      required: true,
    }
  },
};
</script>

<style lang="scss" scoped>
.happy-talk-confirm-modal-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 4.453125vw 3.125vw 0 !important;
  width: 35.9375vw;
  height: 22.65625vw;
  box-sizing: border-box;
  border: solid 0.15625vw #000;
  background-color: #fff;
  border-radius: 1.5625vw;
  .wrap-confirm-message {
    font-family: 'Spoqa Han Sans Neo', 'sans-serif';
    .phone-number {
      text-align: center;
      font-size: 3.125vw;
      letter-spacing: -0.025em;
      font-weight: bold;
    }

    .confirm-message {
      font-size: 1.71875vw;
      letter-spacing: -0.025em;
      text-align: center;
      line-height: 2.27;
    }
  }

  .wrap-action-button {
    margin-top: 3.125vw !important;
    display: flex;
    align-items: center;
    gap: 0.78125vw;

    > button {
      font-family: 'Spoqa Han Sans Neo', 'sans-serif';
      width: 14.453125vw;
      height: 4.53125vw;
      border-radius: 1.015625vw;
      font-size: 2.03125vw;
      letter-spacing: -0.025em;
      border: none;
    }

    .no-button {
      background-color: #e5e5e5;
      color: #666;
    }

    .yes-button {
      background-color: #fc0000;
      color: #fff;
    }
  }
}
</style>
