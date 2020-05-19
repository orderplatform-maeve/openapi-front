<template lang="pug">
.md.md-product-option(v-if="show")
  .md-background
  .md-head
    .md-title 알림
  .md-body-disconnect 소켓 서버가 연결이 끊겼습니다.
</template>

<script>
export default {
  computed: {
    show() {
      console.log(this.$store.state.isDisconnectModal);
      return this.$store.state.isDisconnectModal;
    }
  },
};
</script>

<style lang="scss">
.md-product-option {
  display:flex;
  justify-content: center;
  z-index:19;
  position:fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  flex-direction: column;
  padding:0;
  color:#ffffff;

  .md-background {
    background-color: rgba(0, 0, 0, 0.8);
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: -1;
  }

  .md-head {
    display:flex;
    height:60px;
    margin:12px;
    flex-shrink:0;
    justify-content: space-between;

    .md-title {
      display:inline-block;
      flex-grow: 1;
      line-height:60px;
      padding:0;
      font-size:28px;
      font-weight:100;
      color:#ffffff;
      border-bottom: solid 1px #ffffff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 0,
    }
  }

  .md-body-disconnect {
    display:flex;
    flex-direction: column;
    flex-grow: 1;
    overflow-y: auto;
    padding: 12px;
    margin-bottom: 12px;
    font-size: 28px;
    font-weight: 100;
  }

}

</style>
