<template lang="pug">
.serving-robot-start-modal-container(@click="unVisibleModal")
  .serving-robot-start-modal(@click.prevent.stop)
    .wrap-serving-robot-start-header
      p.serving-robot-start-header 서빙로봇 이동
      icon-exit-black(@click.native.stop="unVisibleModal")
    //- p.serving-robot-start-notion 서빙을 진행하시고자 하는 테이블 번호를 선택해주세요.
    .wrap-tab
      p(
        @click="setCurrentTab('serving')"
        :class="getTabStyle('serving')"
      ) 서빙
      p(
        @click="setCurrentTab('decay')"
        :class="getTabStyle('decay')"
      ) 퇴식
      p(
        @click="setCurrentTab('moving')"
        :class="getTabStyle('moving')"
      ) 이동
    .table-number-list
      p(
        v-for="(table, index) in sortedTables"
        :key="`tableIndex-${index}`"
        :class="getSelectedTableStyle(table)"
        @click="selectTable(table)"
      ) {{getTableName(table)}}
    .wrap-confirm-button
      button.cancel-button(@click="unVisibleModal") 취소
      button.confirm-button(@click="startServingRobot") 확인
</template>

<script>
export default {
  props: {
    sortedTables: {
      type: Array,
      required: true,
    },
    selectedTable: {
      type: String,
      default: '',
    },
    selectTable: {
      type: Function,
      required: true,
    },
    startServingRobot: {
      type: Function,
      required: true,
    },
    unVisibleModal: {
      type: Function,
      required: true,
    },
    setCurrentTab: {
      type: Function,
      required: true,
    },
    currentTab: {
      type: String,
      required: true,
    },
  },
  methods: {
    getTableName(table) {
      return table?.torderTableName;
    },
    getSelectedTableStyle(table) {
      const isSelectedTable = this.selectedTable === this.getTableName(table);

      return {
        'table-number': true,
        'selectedTableStyle': isSelectedTable,
      };
    },
    getTabStyle(tab) {
      return {
        'tab-name': true,
        'select-tab-name': tab === this.currentTab,
      };
    }
  }
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

    .wrap-tab {
      display: flex;
      align-items: center;
      gap: 1.5625vw;

      .tab-name {
        padding: 0 3.90625vw !important;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2.34375vw;
        height: 4.6875vw;
        background-color:#e5e5e5;
        border-radius: 1.015625vw;
        color: #666;
      }

      .select-tab-name {
        background-color: #000;
        color: #fff;
      }
    }

    .table-number-list {
      flex: 1;
      margin-top: 1.5625vw !important;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(auto-fit, 50px);
      gap: 1.5625vw;
      overflow: auto;

      .table-number {
        width: 100%;
        min-height: 4.21875vw;
        font-size: 1.71875vw;
        border: solid 0.078125vw #000;
        border-radius: 1.171875vw;
        padding: 0.78125vw !important;
        box-sizing: border-box;
        display: flex;
        text-align: center;
        justify-content: center;
        align-items: center;
        word-break: break-all;
      }

      .selectedTableStyle {
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