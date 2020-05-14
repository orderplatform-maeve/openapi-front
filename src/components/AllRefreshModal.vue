<template lang="pug">
.md.md-product-option(v-if="show")
  .md-background
  .md-head
    .md-title 새로고침 리스트 {{ data.length }}
  .md-body-refresh
    .row(v-for="tablet in data") 테이블 이름: {{ tablet.tabletName }},  메세지: {{ tablet.msg }}
  .footer
    .md-close-button(
      v-if="enbleCloseButton"
      @click="close()"
    ) 닫기
    .md-disable-button(
      v-if="!enbleCloseButton"
      @click="close()"
    ) 새로고침 요청중
    .md-exit-button(@click="exit()") 강제 종료
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
    data: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    enbleCloseButton() {
      const { allRefreshList } = this.$store.state;

      const currentCount = allRefreshList.length;

      const findTargetCount =  allRefreshList.filter((item) => {
        if (!item?.status) return false;

        return item.status === 'fulfilled' || item.status === 'rejected';
      }).length;

      return currentCount === findTargetCount;
    },
  },
  methods: {
    exit() {
      location.replace('/');
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
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 0,
    }
  }

  .md-body-refresh {
    display:flex;
    flex-direction: column;
    flex-grow: 1;
    overflow-y: auto;
    padding: 12px;
    border-bottom: 1px solid #cecece;
    margin-bottom: 12px;

    .row {
      display: flex;
      border-bottom: 1px dotted #cecece;
      font-size: 24px;
      font-weight: 100;
      padding: 8px;
    }
  }

  .footer {
    display: flex;
    justify-content: space-around;
    align-items: center;

    .md-close-button {
      display:flex;
      align-items: center;
      justify-content: center;
      padding:12px 30px;
      font-size:20px;
      color:#000000;
      border: solid 1px #ffffff;
      border-radius:100px;
      height:60px;
      box-shadow: 0 0 8px -4px #000000;
      background-color:#ffffff;
    }

    .md-disable-button {
      display:flex;
      align-items: center;
      justify-content: center;
      padding:12px 30px;
      font-size:20px;
      color:#000000;
      border: solid 1px #cecece;
      border-radius:100px;
      height:60px;
      box-shadow: 0 0 8px -4px #000000;
      background-color:#cecece;
    }

    .md-exit-button {
      display:flex;
      align-items: center;
      justify-content: center;
      padding:12px 30px;
      font-size:20px;
      color:white;
      border-radius:100px;
      height:60px;
      box-shadow: 0 0 8px -4px #000000;
      background-color:red;
    }
  }

}

</style>
