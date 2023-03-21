<template lang="pug">
.cancel-payment-order-page-container
  AlertModalTwoButton(
    v-if="isAlertTwoBtModal"
    :confirm="() => postPendPaymentTableOrder()"
  )
  .title-wrap
    p.cancel-payment-order-page-title 결제 보류 처리
    button.refresh-button(@click="clickRefresh()")
      refresh-black-new-icon
      | 새로고침
  .tab-panel-list
    .panel-item(@click="setPanelType('table')" :class="{'panel-active': panelType === 'table'}")
      p 테이블 보기
    .panel-item(@click="setPanelType('list')" :class="{'panel-active': panelType === 'list'}")
      p 보류 리스트
  .panel-body(v-if="panelType === 'table'")
    button(:class="getTableBoxStyle(table)" v-for="table in tableList" :key="table.tabletCode" @click="openCheckAlert(table)")
      p {{ getTableName(table) }}
      p {{ getStatusText(table) }}
  .panel-body(v-if="panelType === 'list'")
</template>

<script>
import { credit } from '@apis';
import { AlertModalTwoButton } from '@components';
import { RefreshBlackNewIcon } from '@svg';
const {
  requestPaymentPend,
  requestTabletStatus
} = credit;

export default {
  data() {
    return {
      tableList: [],
      currentTable: {},
      panelType: 'table',
      doubleClick: false,
      timer: 0,
    };
  },
  components: {
    AlertModalTwoButton,
    RefreshBlackNewIcon
  },
  computed: {
    isAlertTwoBtModal() {
      return this.$store.state.isAlertTwoBtModal;
    },
  },
  methods: {
    async getTabletsStatus() {
      try {
        if (this.doubleClick) {
          return;
        }

        if (this.timer) {
          clearTimeout(this.timer);
        }

        this.timer = setTimeout(() => {
          this.doubleClick = false;
          return;
        }, 2000);

        this.doubleClick = true;
        const config = {
          storeCode: this.$store.state.auth.store.store_code,
        };

        const res = await requestTabletStatus(config);

        if (res.data.resultCode === 200) {
          this.tableList = res.data.resultData.tabletStatusList;
        } else {
          return this.$store.commit('pushFlashMessage', '테이블 정보를 불러오는데 실패했습니다. 새로고침 해주시길 바랍니다.');
        }

      } catch (error) {
        console.log(error);
      }
    },
    getTableName(table) {
      return table?.tabletNumber;
    },
    async postPendPaymentTableOrder() {
      try {
        const config = {
          storeCode: this.$store.state.auth.store.store_code,
          tabletCode: this.currentTable.tabletCode,
        };

        const res = await requestPaymentPend(config);

        if (res.data.resultCode === 200) {
          this.$store.commit('pushFlashMessage', '해당 테이블의 결제를 보류 처리 했습니다!');
        } else {
          this.$store.commit('pushFlashMessage', '결제 보류 처리에 실패했습니다. 티오더로 문의 바랍니다.');
        }
        this.$store.commit('updateIsAlertTwoBtModal', false);
      } catch (error) {
        console.log(error);
      }
    },
    openCheckAlert(table) {
      if (table.status === 'PAYING' || table.status === 'FAIL') {
        this.currentTable = table;
        this.$store.commit('updateAlertTwoBtMessage', `"테이블 ${table.tabletNumber}"의 결제 내역을 <br/>보류 처리하시겠습니까?`);
        this.$store.commit('updateIsAlertTwoBtModal', true);
      }
    },
    getTableBoxStyle(table) {
      return {
        'table-box': true,
        'status-paying' : table.status === 'PAYING',
        'state-fail': table.status === 'FAIL',
      };
    },
    getStatusText(table) {
      if (table.status === 'PAYING' || table.status === 'FAIL') {
        return table.statue === 'PAYING' ? '결제 진행 중' : '포스 접수 실패';
      }
      return '';
    },
    setPanelType(value) {
      document.querySelector('.tab-panel-list').scrollTop = 0;
      this.panelType = value;
    },
    clickRefresh() {
      if (this.panelType === 'table') {
        this.getTabletsStatus();
      }
      if (this.panelType === 'list') {
        // 보류리스트 조회 api
      }
    }
  },
  mounted() {
    this.getTabletsStatus();
  },
};

</script>

<style lang="scss" scoped>
.cancel-payment-order-page-container {
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-size: 1.71875vw;
  box-sizing: border-box;


  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1.5625vw !important;
  .cancel-payment-order-page-title {
    font-family: "notosans";
    font-weight: bold;
    font-size: 1.71875vw;
    padding: 2.5vh 0 !important;
    box-sizing: border-box;
    color: #fff;
  }

  .refresh-button {
    width: 8.515625vw;
    height: 2.65625vw;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.546875vw;
    border-radius: 0.390625vw;
    border: solid 0.078125vw #000;
    background-color: #fff;
  }

  }


  .tab-panel-list {
    width: 83.59375vw;
    display: flex;
    align-items: center;
    gap: 0.78125vw;
    font-size: 1.5625vw;
    font-weight: bold;
    color: #ddd;

    .panel-item {
      padding: 0 1.5625vw !important;
      min-height: 4.6875vw;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1.5625vw;
      background-color: #404144;
      border-top-left-radius: 0.78125vw;
      border-top-right-radius: 0.78125vw;
      letter-spacing: -0.0390625vw;
    }

    .panel-active {
      background-color: #fff !important;
      color: #000;
      font-weight: bold;
    }
  }

  .panel-body {
    display: grid;
    grid-template-columns: repeat(auto-fill, 10.9375vw);
    align-items: center;
    gap: 0.78125vw;
    overflow-y: scroll;
    padding: 1.5625vw !important;
    background-color: #fff;
    min-height: 49.2188vw;
    .table-box {
      min-height: 4.6875vw;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: #e5e5e5;
      border: none;
      border-radius: 1.015625vw;
      font-family: 'Spoqa Han Sans Neo', 'sans-serif';
      font-size: 1.5625vw;
      color: #666;
      letter-spacing: -0.0390625vw;
      text-align: center;
    }

    .status-paying {
      background-color: #f7ac1e;
      color: #fff;
    }

    .state-fail {
      background-color: #e33d3d;
      color: #fff;
    }
  }
}
</style>