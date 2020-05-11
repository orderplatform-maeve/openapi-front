<template lang="pug">
.md.md-product-option(v-if="show")
  .md-background
  .md-head
    .md-title 새로고침 리스트 {{ data.length }}
    .md-close-button(@click="close()") 닫기
  .md-body
    div(v-for="tablet in data")
      p {{ tablet.status }}
      p {{ tablet.tabletName }}
      p {{ tablet.msg }}
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    close: {
      type: Function,
      default: () => {},
    },
    onSubmit: {
      type: Function,
      default: () => {},
    },
    data: {
      type: Array,
      default() {
        return [];
      },
    },
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
      border-bottom:solid 1px #ffffff;
      margin-right:12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .md-close-button {
      display:flex;
      align-items: center;
      justify-content: center;
      padding:0 30px;
      font-size:20px;
      color:#000000;
      border: solid 1px #ffffff;
      border-radius:100px;
      height:60px;
      box-shadow: 0 0 8px -4px #000000;
      background-color:#ffffff;

      svg {
        margin-right:8px;
        width:auto;
        height:16px;

        * {
          fill: #000000;
        }
      }
    }
    .md-close-button:active {
      opacity:0.4;
    }
  }

  .md-body {
    display:flex;
    flex-direction:row;
    flex-grow: 1;
    overflow-y: auto;

  }
}

</style>
