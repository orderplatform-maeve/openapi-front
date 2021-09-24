<template lang="pug">
.additional-container
  p.additional-title 추가기능
  .wrap-button-added
    //- router-link.button-added(v-if="visibleOrderButton" :to="paths.products") 상품 관리(구)
    //-   <br> (테스트)
    router-link.button-added(v-if="visibleOrderButton" :to="paths.newProducts") 상품 관리(신) (테스트)
    router-link.button-added(v-if="visibleOrderButton" :to="paths.tables") 테이블 주문 (테스트)
    router-link.button-added(v-if="visibleOrderButton" :to="paths.pickUpTables") 픽업 요청 (테스트)
    router-link.button-added(v-if="visibleOrderButton" :to="paths.controlOrder") 테이블 주류 주문 관리 (테스트)
    router-link.button-added(v-if="visibleOrderButton" :to="paths.updateCategories") 분류 관리 (테스트)
    router-link.button-added(v-if="visibleOrderButton" :to="paths.controlLastOrder") 타이머 관리 (테스트)
    router-link.button-added(v-if="visibleOrderButton" :to="paths.cancelPaymentOrder") 결제 주문 강제 취소 (테스트)
    router-link.button-added(v-if="visibleOrderButton" :to="paths.oldPaymentManagement") 구 결제내역 (테스트)
    router-link.button-added(v-if="visibleOrderButton" :to="paths.newPaymentManagement") 신 결제내역 (테스트)
</template>

<script>
import paths from '@router/paths';

export default {
  data: () => ({
    paths,
  }),
  methods: {
    visibleOrderButton() {
      const { auth } = this;
      return !!(auth && auth.store && auth.store.store_code);
    },
  }
};
</script>

<style lang="scss" scoped>
.additional-container {
  padding: 0 1.5625vw !important;
  font-family: "notosans-bold";
  font-size: 1.71875vw;
  color: #fff;
  box-sizing: border-box;

  .additional-title {
    font-size: 1.71875vw !important;
    padding: 1.171875vw 0 !important;
    border-bottom: solid 0.078125vw #464656;
    box-sizing: border-box;
  }

  .wrap-button-added {
    margin-top: 1.5625vw !important;
    display: flex;
    flex-direction: column;
    gap: 0.390625000vw !important;
    
    .button-added {
        width: 100%;
        padding: 1.5625vw 2.34375vw !important;
        font-size: 2.03125vw;
        color: #fff !important;
        background-color: #26262d;
        text-decoration: none;
        text-align: center;
        box-sizing: border-box;
        text-align: left;
      }
  }
}
</style>
