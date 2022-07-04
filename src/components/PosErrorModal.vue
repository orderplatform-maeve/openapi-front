<template lang="pug">
.confirm-modal-container
  .wrap-confirm-modal
    p.confirm-modal-title 오류 발생
    .confirm-modal-body
      p.confirm-modal-body-title {{tableNumber()}} 테이블
      p.confirm-modal-body-message 주문이 정상적으로 접수되지 못하였습니다.
      p.confirm-modal-body-message {{orderKey()}}
    .confirm-modal-footer
      button.confirm-modal-button-commit 주문 내역 오류 보기
      button.confirm-modal-button-close 닫기
</template>

<script>
export default {
  computed: {
    order() {
      return this.$store.state.order;
    },
    tableNumber() {
      return this.order?.tableNumber;
    },
    orderKey() {
      return this.order?.orderKey;
    }
  },
  sockets: {
    orderview(payload) {
      if (payload?.type_msg === 'commit') {
        // console.log('local');
        clearInterval(this.interval);
        this.isConfirm = false;
      }
    },
  },
  methods: {
    closeOrder() {
      clearInterval(this.interval);
      this.$store.commit('UNSET_ORDER');
    },
  },
  mounted() {
    console.log(this.order, 'order pos error');
  },
};

</script>

<style lang="scss" scoped>
.confirm-modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color:rgba(0,0,0,0.8);
  z-index: 201;
  display: flex;
  justify-content: center;
  align-items: center;

  .wrap-confirm-modal {
    width: 80%;
    padding: 0 1.875vw !important;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 3.125vw;

    .confirm-modal-title {
      text-align: center;
      font-family: 'Spoqa Han Sans Neo', 'sans-serif';
      font-size: 1.875vw;
      font-weight: bold;
      color: #fff;
      background-color: rgb(255, 0, 0, 0.7);
      padding: 1.875vw !important;
      box-sizing: border-box;
      border-radius: 1.875vw;
    }

    .confirm-modal-body {
      font-family: 'Spoqa Han Sans Neo', 'sans-serif';
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 1.5625vw;
      padding: 1.875vw !important;
      box-sizing: border-box;
      border-radius: 1.875vw;
      background-color: rgb(255, 0, 0, 0.8);

      .confirm-modal-body-title {
        font-size: 6.25vw;
        font-weight: bold;
        word-break: keep-all;
      }

      .confirm-modal-body-message {
        font-size: 3.125vw;
        font-weight: lighter;
        word-break: keep-all;
      }
    }

    .confirm-modal-footer {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1.5625vw;
      padding: 1.875vw !important;
      box-sizing: border-box;
      border-radius: 1.875vw;
      background-color: rgb(255, 0, 0, 0.8);

      > button {
        flex: 1;
        height: 6.25vw;
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        font-size: 1.875vw;
        border-radius: 7.8125vw;
        border: none;
        box-shadow: 0 0 8px -4px #000000;
      }

      .confirm-modal-button-commit {
        background-color: #ff0000;
        color: #fff;
      }

      .confirm-modal-button-close {
        background-color: #ffffff;
        color: #202020;
      }
    }
  }
}

</style>
