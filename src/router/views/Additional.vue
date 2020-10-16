<template lang="pug">
#orderview
  //- router-link.button-added(v-if="visibleOrderButton" :to="paths.products") 상품 관리(구)
  //-   <br> (테스트)
  router-link.button-added(v-if="visibleOrderButton" :to="paths.newProducts") 상품 관리(신)
    <br> (테스트)
  router-link.button-added(v-if="visibleOrderButton" :to="paths.tables") 테이블 주문
    <br> (테스트)
  router-link.button-added(v-if="visibleOrderButton" :to="paths.pickUpTables") 픽업 요청
    <br> (테스트)
  router-link.button-added(v-if="visibleOrderButton" :to="paths.controlOrder") 테이블 주류 주문 관리
    <br> (테스트)
  //- router-link.button-added(v-if="visibleOrderButton" :to="paths.updateCategories") 분류 관리
  //-   <br> (테스트)
  router-link.button-added(v-if="visibleOrderButton" :to="paths.controlLastOrder") 타이머 관리
    <br> (테스트)
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

<style lang="scss">
  .button-added {
    display:flex;
    align-items: center;
    justify-content: center;
    margin-top: 8px;
    margin-bottom: 4px;
    width: 100%;
    background-color: #ffffff;
    color: #000000;
    font-weight: 900;
    text-decoration: none;
    text-align: center;
    font-size: 36px;
    padding: 8px 0;
  }
</style>
