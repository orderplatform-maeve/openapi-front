<template lang="pug">
  .auction-manager-container
    iframe.frame(src="http://dev.auction.torder.co.kr/")
</template>

<style lang="scss" scoped>
.auction-manager-container {
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  box-sizing: border-box;
  overflow: auto;
  .frame {
    width: 100%;
    height: 100vh;
    border: none;
  }
}
</style>
