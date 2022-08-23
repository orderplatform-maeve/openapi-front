<template lang="pug">
.option-sold-out-modal-container
  .close-bt 닫기
  .wrap-option-sold-out-modal

</template>

<script>
export default {
  data() {
    return {

    };
  },
  computed: {
    // optionSoldOutModalFlag() {
    //   const optionSoldOutModal = this.$store.state.optionSoldOutModal;
    //   return optionSoldOutModal;
    // }
  },
  methods: {
    //
  },
};

</script>

<style lang="scss" scoped>
.option-sold-out-modal-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.9375vw;
  z-index: 101;
  background-color: rgba(0, 0, 0, 0.7);

  .close-bt {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 146px;
    height: 64px;
    border-radius: 32px;
    background-color: #fff;
    color: #000;
    font-size: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .wrap-option-sold-out-modal {
    width: 1054px;
    height: 664px;
    background-color: #111;
    border-radius: 1.5625vw;
    padding: 1.5625vw 0 !important;
    box-sizing: border-box;
    border: 2px solid #666;
  }
}
</style>