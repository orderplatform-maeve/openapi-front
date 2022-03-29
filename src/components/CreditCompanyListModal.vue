<template lang="pug">
  .credit-company-list-modal-container(@click.self="closeSearchModal")
    .wrap-credit-company-list-modal
      p.credit-company-list-modal-title 카드사 선택
      .button-list
        button(
          v-for="(value, name) in data.list"
          :key="`index-`+name+'value'+value.name"
          :class="{activeButton: data.selected == name}"
          @click="selectOption(type, name)") {{value.name}}
</template>

<script>
export default {
  name: 'CreditCompanyListModal',
  props: {
    data: {
      type: Object,
    },
    type: {
      type: String,
    },
    selectOption: {
      type: Function,
    },
    closeSearchModal: {
      type: Function,
    }
  },
};
</script>

<style lang="scss" scoped>
.credit-company-list-modal-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  font-family: 'Spoqa Han Sans Neo', 'sans-serif';
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 1;

  .wrap-credit-company-list-modal {
    width: 67.96875vw;
    padding: 3.125vw !important;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 1.5625vw;

    .credit-company-list-modal-title {
      font-size: 1.5625vw;
      letter-spacing: -0.0390625vw;
    }

    .button-list {
      margin-top: 1.5625vw !important;
      display: grid;
      grid-template-columns: repeat(auto-fill, 11.71875vw);
      align-items: center;
      gap: 0.78125vw;

      > button {
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        font-size: 1.875vw;
        letter-spacing: -0.0468750vw;
        color: #666;
        height: 4.6875vw;
        background-color: #e5e5e5;
        border: none;
        border-radius: 1.015625vw;
      }

      .activeButton {
        color: #fff;
        font-weight: bold;
        background-color: #12151d;
      }
    }
  }
}

</style>