<template lang="pug">
.additional-container
  p.additional-title 추가기능(테스트)
  .wrap-button-added
    //- router-link.button-added(v-if="visibleOrderButton" :to="paths.products") 상품 관리(구)
    //-   <br> (테스트)
    router-link.button-added(v-if="visibleOrderButton" :to="paths.newProducts") 상품 관리(신)<br>
      span (테스트)
    router-link.button-added(v-if="visibleOrderButton" :to="paths.tables") 테이블 주문<br>
      span (테스트)
    router-link.button-added(v-if="visibleOrderButton" :to="paths.pickUpTables") 픽업 요청<br>
      span (테스트)
    router-link.button-added(v-if="visibleOrderButton" :to="paths.controlOrder") 테이블<br> 주류 주문 관리<br>
      span (테스트)
    router-link.button-added(v-if="visibleOrderButton" :to="paths.updateCategories") 분류 관리<br>
      span (테스트)
    router-link.button-added(v-if="visibleOrderButton" :to="paths.controlLastOrder") 타이머 관리<br>
      span (테스트)
    router-link.button-added(v-if="visibleOrderButton" :to="paths.cancelPaymentOrder") 결제 주문 강제 취소<br>
      span (테스트)
    router-link.button-added(v-if="visibleOrderButton" :to="paths.oldPaymentManagement") 구 결제내역<br>
      span (테스트)
    router-link.button-added(v-if="visibleOrderButton" :to="paths.newPaymentManagement") 신 결제내역<br>
      span (테스트)
    router-link.button-added(v-if="visibleOrderButton" :to="paths.servingRobotManagement") 로봇 관리<br>
      span (테스트)
    router-link.button-added(v-if="visibleOrderButton" :to="paths.auctionManager") 경매 관리<br>
      span (테스트)
    router-link.button-added(v-if="useGame" :to="paths.gameManagement") 게임 관리<br>
      span (테스트)
</template>

<script>
import paths from '@router/paths';
import { STOP_REDIRECT } from '@utils/constants';
import { tableGame } from '@apis';

const {
  gameStoreInfo
} = tableGame;

export default {
  data: () => ({
    paths,
    stopRedirect: STOP_REDIRECT,
    useGame : false,
  }),
  methods: {
    visibleOrderButton() {
      const { auth } = this;
      return !!(auth && auth.store && auth.store.store_code);
    },
    async reqGameStoreInfo() {
      try {
        const storeCode = this.$store.state.auth.store.store_code;
        const res = await gameStoreInfo(storeCode);

        if (res.data.resultCode === 200) {
          if (res.data.resultData.useTableGame) {
            this.useGame = true;
          } else {
            this.useGame = false;
          }
        }
      } catch (error) {
        console.log(error);
      }

    },
  },
  mounted() {
    this.reqGameStoreInfo();
  }
};
</script>

<style lang="scss" scoped>
.additional-container {
  flex: 1;
  padding: 0 1.5625vw !important;
  font-family: "notosans";
  font-weight: bold;
  font-size: 1.71875vw;
  background-color: #fff;
  box-sizing: border-box;

  .additional-title {
    font-family: "notosans";
    font-weight: bold;
    font-size: 1.71875vw;
    padding: 1.5625vw 0 !important;
    box-sizing: border-box;
  }

  .wrap-button-added {
    display: grid;
    grid-template-columns: repeat(auto-fill, 19.53125vw);
    gap: 1.09375vw;

    .button-added {
        width: 100%;
        height: 14.0625vw;
        padding: 1.5625vw 2.34375vw !important;
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        font-size: 1.875vw;
        font-weight: bold;
        letter-spacing: -0.046875vw;
        word-break: keep-all;
        background-color: #f5f5f5;
        text-decoration: none;
        box-sizing: border-box;
        border: solid 0.078125vw #d6d6d6;
        border-radius: 0.78125vw;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        align-items: center;

        span {
          font-weight: normal;
        }
      }
  }
}
</style>
