<template lang="pug">
.md-alert
  .md-background
  .md-container
    .md-message(v-html="message")
    .md-footer
      .md-confirm-btn(@click="closeModal") 취소
      .md-cancel-btn(@click="confirm()") 확인
</template>

<script>
export default {
  props: {
    confirm: {
      type: Function,
    }
  },
  computed: {
    message() {
      return this.$store.state.alertTwoBtMessage;
    },
  },
  methods: {
    closeModal() {
      this.$store.commit('updateIsAlertTwoBtModal', false);
    }
  },
};
</script>

<style lang="scss" scoped>
.md-alert {
  display:flex;
  justify-content: center;
  align-items: center;
  z-index:19;
  position:absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
  flex-direction: column;
  padding:0;
  z-index: 1000;

  .md-background {
    background-color: rgba(0, 0, 0, 0.8);
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
  }

  .md-container {
    width: 33.75vw;
    height: 40.704225352112676vh;
    border-top-left-radius: 0.6250vw;
    border-top-right-radius: 0.6250vw;
    background-color: white;

    .md-message {
      height: 33.098591549295775vh;
      color: black;
      font-size: 1.71875vw;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
    }


    .md-footer {
      height: 7.605633802816901vh;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-size: 1.875vw;
      background-color: #333333;

      .md-confirm-btn {
        width: 50%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fc0000;
      }

      .md-cancel-btn {
        width: 50%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #333333;
      }
    }
  }
}
</style>
