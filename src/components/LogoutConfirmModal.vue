<template lang="pug">
.logout-confirm-modal-container
  .logout-confirm-modal
    .wrap-confirm-message
      p.logout-confirm-message 로그아웃 하시겠습니까?
    .wrap-action-button
      button.no-button(@click="noAction") 취소
      button.yes-button(@click="yesAction") 확인
</template>

<script>
export default {
  props: {
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

.logout-confirm-modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  .logout-confirm-modal {
    width: 45vw;
    height: 20vw;
    box-sizing: border-box;
    border: solid 0.15625vw #000;
    background-color: #fff;
    border-radius: 1.5625vw;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .wrap-confirm-message {
      font-family: 'Spoqa Han Sans Neo', 'sans-serif';
      .logout-confirm-message {
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
}
</style>
