<template lang="pug">
  .valet-parking-confirm-container
    .valet-parking-confirm-header
      torder-logo-v2(
        :width="'9.46875vw'"
        :height="'4.375vw'"
      )
      .wrap-close-text(@click="goHome")
        close-text
    .wrap-parking-confirm-message
      .wrap-parking-car-number
        p.parking-car-number(
          v-for="(car, index) in getCarNumberArray"
          :key="`car-key-${index}`"
        ) {{car}}
      p.parking-success-title-message 차량 출차가 완료되었습니다.
      p.parking-success-message 매장을 이용해 주셔서 감사합니다.
      .wrap-parking-car-image
        img.parking-car-image(src="https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/banner/moveCar.gif")
      p.parking-last-message 주차 정산은 매장 안내를 따라 주시면 감사하겠습니다.
</template>

<script>
// 배너 페이지에서 접속했을 때 배너 페이지 닫도록 하는 작업 해야함 (소켓에서 신호를 줬을 때 닫으면 될 듯);
import {
  TorderLogoV2,
  CloseText,
} from '@svg';

export default {
  components: {
    TorderLogoV2,
    CloseText,
  },
  computed: {
    getCarNumberArray() {
      const data = this.$store.state.valet.carNumber;

      if (data[0]) {
        return data[0].split('');
      }
      return [];
    }
  },
  methods: {
    initCarNumber() {
      this.$store.commit('valet/initCarNumber');
    },
    deleteCarNumber() {
      this.$store.commit('valet/deleteCarNumber');
    },
    goHome() {
      if (this.$store.state.valet.carNumber.length > 1) {
        this.deleteCarNumber();
        return;
      }

      if (this.$route.path !== '/') {
        this.initCarNumber();
        this.$router.push('/');
      }
    },
  },
  beforeDestroy() {
    this.initCarNumber();
  }
};
</script>

<style lang="scss" scoped>
.valet-parking-confirm-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  z-index: 50;
  padding: 1.5625vw 2.34375vw !important;
  box-sizing: border-box;

  .valet-parking-confirm-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .wrap-parking-confirm-message {
    margin-top: 1.3125vw !important;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: "Spoqa Han Sans Neo", "sans-serif";

    .wrap-parking-car-number {
      display: flex;
      align-items: center;
      gap: 1.5625vw;

      .parking-car-number {
        width: 9.6875vw;
        height: 11.171875vw;
        background-color: #fff;
        border-radius: 1.171875vw;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        font-size: 8.359375vw;
        color: #000;
        margin: 0 !important;
        padding: 0 !important;
      }
    }

    .parking-success-title-message {
      margin: 2.4765625vw 0 0 0 !important;
      padding: 0 !important;
      font-size: 5.46875vw;
      font-weight: bold;
      letter-spacing: -0.2734375vw;
      color: #fff;
    }

    .parking-success-message {
      margin: 0.8046875vw 0 0 0 !important;
      font-size: 3.515625vw;
      font-weight: lighter;
      letter-spacing: -0.17578125vw;
      color: #fff;
    }

    .parking-last-message {
      margin: 0.78125vw 0 0 0 !important;
      font-size: 1.875vw;
      letter-spacing: -0.09375vw;
      color: #fff;
    }
  }
}
</style>