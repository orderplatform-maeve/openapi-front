<template lang="pug" functional>
#ModalConfirm(v-if="show")
  .background
  .container
    .top
      .title 조심해요!!
    .body
      .title(v-if="title") {{title}}
      .message(v-if="message") {{message}}
    .foot
      .buttons
        .button.button-commit(@click="confirm") 확인
        .button.button(@click="close") 닫기
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    confirm: {
      type: Function,
      default: () => {},
    },
    close: {
      type: Function,
      default: () => {},
    },
  },
};
</script>

<style lang="scss">
#ModalConfirm {
  position:fixed;
  top:0;
  left:0;
  display:flex;
  align-items: center;
  justify-content: center;

  width:100%;
  height:100%;
  z-index:201;

  > .background {
    position:absolute;
    top:0;
    left:0;
    display:flex;
    width:100%;
    height:100%;
    z-index:102;
    background-color:rgba(0,0,0,0.8);
  }
  > .container {
    display:flex;
    flex-direction:column;
    align-items: center;
    justify-content: center;
    width:80%;
    height:80%;
    z-index:103;
    flex-grow:0 !important;
    padding:0 24px;

    > * {
      padding:24px;
    }
    > .top {
      flex-shrink:0;
      display:flex;
      width:100%;
      border-top-left-radius:24px;
      border-top-right-radius:24px;
      background-color:rgba(255,0,0,0.7);
      color:#ffffff;
      .title {
        font-size:24px;
        font-weight:900;
      }
    }
    > .body {
      flex-grow:1;
      flex-shrink:1;
      display:flex;
      flex-direction:column;
      width:100%;
      align-items: center;
      justify-content: center;
      overflow:scroll;
      background-color:rgba(255,0,0,0.8);

      .title {
        font-size: 80px;
        font-weight: 900;
        word-break: keep-all;
      }
      .message {
        margin-top:12px;
        font-size: 40px;
        font-weight: 100;
        word-break: keep-all;
      }
    }
    > .foot {
      flex-shrink:0;
      width:100%;
      background-color:rgba(255,255,255,0.8);
      border-bottom-left-radius:24px;
      border-bottom-right-radius:24px;

      .buttons {
        display:flex;
        align-items: center;
        justify-content: center;
        width:100%;
        .button {
          margin:0;
          display:flex;
          flex-grow:1;
          align-items: center;
          justify-content: center;
          height:80px;
          border-radius:100px;
          font-size:24px;
          font-weight:900;
          background-color:#ffffff;
          color:#202020;
          margin-left:24px;
          box-shadow: 0 0 8px -4px #000000;
        }
        .button:first-child {
          margin-left:0;
        }
        .button-commit {
          flex-grow:1;
          background-color:#ff0000;
          color:#ffffff;
        }
      }
    }
  }
}
</style>
