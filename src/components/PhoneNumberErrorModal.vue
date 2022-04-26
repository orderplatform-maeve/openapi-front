<template lang="pug">
.phone-number-error-modal-container(v-if="isVisible")
  p.phone-number-error-message 핸드폰 번호를 다시 확인해주세요.
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    }
  }
};
</script>

<style lang="scss" scoped>
.phone-number-error-modal-container {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  animation: opacityAnimation 0.5s linear;
  animation-delay: 1s;
  animation-fill-mode: forwards;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  width: 39.0625vw;
  height: 11.71875vw;
  border-radius: 1.5625vw;

  .phone-number-error-message {
    font-family: 'Spoqa Han Sans Neo', 'sans-serif';
    font-size: 2.34375vw;
    font-weight: bold;
    letter-spacing: -0.05859375vw;
    color: #fff;
  }
}

@keyframes opacityAnimation {
  0% {
    opacity: 1;
  }
  100% {
    opacity:0;
  }
}
</style>