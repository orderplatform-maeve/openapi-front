<template lang="pug">
.happy-talk-success-modal-container(v-if="isVisible")
  p.happy-talk-success-message
    span {{phoneNumber}} 번호로
    span.yellow  카카오톡 메세지
    span 가 발송 되었습니다.
  p.happy-talk-success-message 카카오톡에서 메세지를 확인해주세요.
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    phoneNumber: {
      type: String,
      required: true,
    }
  }
};
</script>

<style lang="scss" scoped>
.happy-talk-success-modal-container {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  animation: opacityAnimation 0.5s linear;
  animation-delay: 1s;
  animation-fill-mode: forwards;
  background-color: #000;
  color: #fff;
  width: 65.3125vw;
  height: 15.546875vw;
  border-radius: 1.5625vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .happy-talk-success-message {
    color: #fff;
    font-family: 'Spoqa Han Sans Neo', 'sans-serif';
    font-size: 2.34375vw;
    font-weight: bold;
    letter-spacing: -0.05859375vw;

    .yellow {
      color: #f9e000;
    }
  }
}

@keyframes opacityAnimation {
  0% {
    opacity: 1;
  }
  100% {
    opacity:0;
    display: none;
  }
}
</style>