<template lang="pug">
  .serving-robot-start-modal-container
    .serving-robot-start-modal
      .wrap-serving-robot-start-header
        p.serving-robot-start-header 서빙안내
        icon-exit-black
      p.serving-robot-start-notion 서빙을 진행하시고자 하는 테이블 번호를 선택해주세요.
      .table-number-list
        p.table-number.selectTable T1asdas
        p.table-number T1123123
        p.table-number T1123123
        p.table-number T11232
        p.table-number T11312
        p.table-number T131231
        p.table-number T1asd
        p.table-number T14123
        p.table-number T112
        p.table-number T12312
        p.table-number T1123123312312
        p.table-number T1323
        p.table-number T1232
        p.table-number T1
        p.table-number T1123123
        p.table-number T122
        p.table-number T1123123
        p.table-number T1323
        p.table-number T1123213
        p.table-number T132
        p.table-number T13213123
        p.table-number T13213123
        p.table-number T1312312
        p.table-number T121231213
        p.table-number T11231232
        p.table-number T1123
      .wrap-confirm-button
        button.cancel-button 취소
        button.confirm-button 확인
</template>

<script>
export default {

};
</script>

<style lang="scss" scoped>
.serving-robot-start-modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);

  .serving-robot-start-modal {
    width: 60%;
    height: 90%;
    background-color: #fff;
    border-radius: 1.5625vw;
    padding: 1.5625vw !important;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .wrap-serving-robot-start-header {
      padding: 1.5625vw 0 !important;
      box-sizing: border-box;
      font-family: "notosans";
      font-size: 2.734375vw;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .serving-robot-start-notion {
      font-family: "notosans";
      font-size: 1.71875vw;
    }

    .table-number-list {
      flex: 1;
      margin-top: 1.5625vw !important;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: auto;
      gap: 1.5625vw;
      overflow: auto;
      
      .table-number {
        width: 100%;
        font-size: 1.71875vw;
        border: solid 0.078125vw #000;
        border-radius: 1.171875vw;
        padding: 0.78125vw !important;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        word-break: break-all;
      }

      .selectTable {
        border: solid 0.234375vw #fc0000;
        color: #fc0000;
      }
    }

    .wrap-confirm-button {
      padding: 2.34375vw 0 0 !important;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.78125vw;

      > button {
        width: 12.5vw;
        height: 4.6875vw;
        font-family: "notosans";
        font-size: 2.34375vw;
        border-radius: 0.78125vw;
        background-color: unset;
      }

      .cancel-button {
        border: solid 0.078125vw #000;
      }

      .confirm-button {
        border: none;
        background-color: #fc0000;
        color: #fff;
      }
    }
  }
}
</style>