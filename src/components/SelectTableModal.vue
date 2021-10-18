<template lang="pug">
  .select-table-modal-container(@click.self="closeSearchModal")
    .wrap-select-table-modal
      p.select-table-modal-title 테이블 선택
      .button-list
        button(
          v-for="(value, name) in data.list"
          :key="`index-`+name+'value'+value.name"
          :class="{activeButton: value.selected}"
          @click="toggleTable(value)") {{value.Tablet_name}}
      .wrap-submit-button
        button.submit(@click="closeSearchModal") 선택완료
</template>

<script>
export default {
  name: 'SelectTableModal',
  props: {
    data: {
      type: Object,
    },
    type: {
      type: String,
    },
    toggleTable: {
      type: Function,
    },
    closeSearchModal: {
      type: Function,
    }
  },
};
</script>

<style lang="scss" scoped>
.select-table-modal-container {
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

  .wrap-select-table-modal {
    width: 67.96875vw;
    padding: 3.125vw 3.125vw 0 !important;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 1.5625vw;

    .select-table-modal-title {
      font-size: 1.5625vw;
      letter-spacing: -0.0390625vw;
    }

    .button-list {
      margin-top: 1.5625vw !important;
      max-height: calc(80vh - 14.296875vw);
      display: grid;
      grid-template-columns: repeat(auto-fill, 11.71875vw);
      align-items: center;
      gap: 0.78125vw;
      overflow: auto;

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

    .wrap-submit-button {
      padding: 1.5625vw 0 !important;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;

      .submit {
        width: 37.5vw;
        height: 4.53125vw;
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        font-weight: bold;
        font-size: 2.03125vw;
        color: #fff;
        background-color: #fc0000;
        border: none;
        border-radius: 1.015625vw;
      }
    }
  }
}

</style>