<template lang="pug">
.md.alert
  .md-background
  .md-container
    .md-message {{ message }}
    .md-confirm(@click="onConfirm") 확인
</template>

<script>
export default {
  computed: {
    message() {
      return this.$store.state.alertModalMessage;
    },
  },
  methods: {
    onConfirm() {
      this.$store.commit('updateIsAlertModal', false);
    },
  },
};
</script>

<style lang="scss" scoped>
.md.alert {
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
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
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

    .md-confirm {
      background-color: #fc0000;
      height: 7.605633802816901vh;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-size: 1.875vw;
    }
  }
}
</style>
