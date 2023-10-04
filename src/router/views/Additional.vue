<template lang="pug">
.additional-container
  p.additional-title 추가기능(테스트)
  .wrap-button-added
    //- router-link.button-added(v-if="visibleOrderButton" :to="paths.products") 상품 관리(구)
    //-   <br> (테스트)
    router-link.button-added(v-if="visibleOrderButton" :to="paths.newProducts") 상품 관리(신)<br>
    router-link.button-added(v-if="visibleOrderButton" :to="paths.updateCategories") 분류 관리<br>
    router-link.button-added(:to="paths.updateGames")
      span 게임 관리
      img(src="https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/icons/beta_r.png")
    router-link.button-added(v-if="visibleOrderButton" :to="paths.tables")
      span 테이블 주문
      img(src="https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/icons/beta_r.png")
    router-link.button-added(v-if="visibleOrderButton" :to="paths.pickUpTables")
      span 픽업 요청
      img(src="https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/icons/beta_r.png")
    router-link.button-added(v-if="visibleOrderButton" :to="paths.controlOrder")
      span 테이블<br> 주류 주문 관리<br>
      img(src="https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/icons/beta_r.png")
    router-link.button-added(v-if="visibleOrderButton" :to="paths.controlLastOrder")
      span 타이머 관리
      img(src="https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/icons/beta_r.png")
    router-link.button-added(v-if="isTorderTwo || isRemakePaid" :to="paths.cancelPaymentOrder")
      span 결제 주문 강제 취소
      img(src="https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/icons/beta_r.png")
    router-link.button-added(v-if="visibleOrderButton" :to="paths.oldPaymentManagement")
      span 구 결제내역
      img(src="https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/icons/beta_r.png")
    router-link.button-added(v-if="visibleOrderButton" :to="paths.newPaymentManagement")
      span 신 결제내역<br>
      img(src="https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/icons/beta_r.png")
    router-link.button-added(v-if="visibleOrderButton" :to="paths.servingRobotManagement")
      span 로봇 관리
      img(src="https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/icons/beta_r.png")
    router-link.button-added(v-if="visibleOrderButton && !isDevTeam" :to="paths.auctionManager")
      span 경매 관리
      img(src="https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/icons/beta_r.png")
    //- router-link.button-added(v-if="useGame" :to="paths.gameManagement")
    //-   span 게임 관리
    //-   img(src="https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/icons/beta_r.png")
    router-link.button-added(v-if="visibleOrderButton" :to="paths.valetTableList")
      span 발렛 파킹
      img(src="https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/icons/beta_r.png")
    router-link.button-added(v-if="visibleOrderButton" :to="paths.ordersIP")
      span 주문 오류 내역
      img(src="https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/icons/beta_r.png")
    router-link.button-added(v-if="visibleOrderButton && stopRedirect" :to="paths.orderStatusCheck")
      span 주문상태확인
      img(src="https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/icons/beta_r.png")
    router-link.button-added(v-if="visibleOrderButton && (isTorderTwo || isRemakePaid)" :to="paths.holdPaymentOrder")
      span 결제 보류 처리
      img(src="https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/icons/beta_r.png")
</template>

<script>
import paths from '@router/paths';
import {
  STOP_REDIRECT,
  IS_DEV_TEAM,
} from '@utils/constants';
import { tableGame } from '@apis';

const {
  gameStoreInfo
} = tableGame;

export default {
  data: () => ({
    paths,
    stopRedirect: STOP_REDIRECT,
    isDevTeam: IS_DEV_TEAM,
    useGame : false,
  }),
  computed: {
    isTorderTwo() {
      return this.$store.state.isTorderTwo;
    },
    isRemakePaid() {
      return this.$store.state.isRemakePaid;
    },
  },
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
  display: flex;
  flex-direction: column;

  .additional-title {
    font-family: "notosans";
    font-weight: bold;
    font-size: 1.71875vw;
    padding: 1.5625vw 0 !important;
    box-sizing: border-box;
  }

  .wrap-button-added {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, 19.53125vw);
    gap: 1.09375vw;
    overflow: auto;
    padding-bottom: 1.5625vw !important;

    .button-added {
      width: 100%;
      height: 14.0625vw;
      padding: 1.5625vw 0 !important;
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
      justify-content: center;
      text-align: center;
      align-items: center;
      gap: 0.15625vw;

      > img {
        width: 3.125vw;
        transform: translateY(-50%);
        font-weight: bold;
      }
    }
  }
}
</style>
