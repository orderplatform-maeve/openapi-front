<template lang="pug">
.order-status-check-container
  router-view
  .wrap-header
    p.control-order-page-title 주문상태확인(테스트)
    button.refresh-robot(@click="tableStatusCheck")
      refresh-black-new-icon
      | 새로고침
  .wrap-table-name
    div(
      v-for="table in sortedTables"
      :key="table.Ta_id"
      :class="getTableStyle(table)"
      @click="goTableCreditInfoPage(table)"
    )
      .wrap-table-status(v-if="defaultStatus(table)")
        p 테이블 번호: {{getTableName(table)}}
        p 테이블 상태: {{getTableStatus(table)}}
        p 앱 버전: {{getAppVersion(table)}}
        p 밴사: {{getVanType(table)}}
        p 시리얼 번호: {{getSerialNumber(table)}}
      .wrap-table-status(v-else)
        p 테이블 번호: {{getTableName(table)}}
        p 결제 방식: {{getTabletOrderType(table)}}
        p 주문 금액: {{getTabletOrderPrice(table)}}
        p 결제 금액: {{getTabletCreditPrice(table)}}
        p 미수금: {{getTabletMisu(table)}}
</template>

<script>
import {
  RefreshBlackNewIcon
} from '@svg';

import {
  payments,
} from '@apis';

const {
  getTableCreditStatList
} = payments;

export default {
  components: {
    RefreshBlackNewIcon,
  },
  data() {
    return {
      tableList: [],
    };
  },
  computed: {
    sortedTables() {
      const tables = JSON.parse(JSON.stringify(this.tableList));
      const sortedTables = tables.sort((a, b) => {
        return a.Tablet_name.length - b.Tablet_name.length || a.Tablet_name.localeCompare(b.Tablet_name);
      });
      return sortedTables;
    },
    getStoreCode() {
      const storeCode = this.$store.state.auth.store.store_code;
      return storeCode;
    },
    standardPriceUnit() {
      const standardPriceUnit = this.$store.state.standardPriceUnit;
      return standardPriceUnit;
    },
    standardPriceFrontPosition() {
      const standardPriceFrontPosition = this.$store.state.standardPriceFrontPosition;
      return standardPriceFrontPosition;
    }
  },
  methods: {
    getTableName(table) {
      const tableName = table.Tablet_name || '';

      return tableName;
    },
    async tableStatusCheck() {
      try {
        const res = await getTableCreditStatList(this.getStoreCode);
        this.tableList = res.data?.list || [];
      } catch(error) {
        console.log(error);
      }
    },
    getTableStatus(table) {
      const tableStat = table.stat || '';

      return tableStat;
    },
    goTableCreditInfoPage(tableInfo) {
      const {
        storeCode,
        Tablet_name,
        Tablet_ID
      } = tableInfo;

      const tableInfoParse = {
        storeCode,
        tableName: Tablet_name,
        tableId: Tablet_ID,
      };

      this.$router.push({
        name: 'tableCreditInfoList',
        query: {
          tableInfo: JSON.stringify(tableInfoParse),
        }
      });
    },
    getAppVersion(tableInfo) {
      const {
        apkVersion
      } = tableInfo;

      return apkVersion;
    },
    getVanType(tableInfo) {
      const creditVanType = tableInfo.creditVanType || '후불결제 테이블';

      return creditVanType;
    },
    getSerialNumber(tableInfo) {
      const {
        serialnumber
      } = tableInfo;

      return serialnumber;
    },
    getTableStyle(tableInfo) {
      const {
        stat
      } = tableInfo;
      const isOrder = stat === 'order';
      const isInCredit = stat === 'InCredit';

      const tableStyle = {
        'table-name': true,
        'table-red': isOrder,
        'table-blue': isInCredit,
      };

      return tableStyle;
    },
    defaultStatus(tableInfo) {
      const {
        stat
      } = tableInfo;

      const isDefaultStatus = stat === 'ready';
      return isDefaultStatus;
    },
    getTabletOrderType(tableInfo) {
      const tabletOrderType = tableInfo.TabletOrderType || '';

      return tabletOrderType;
    },
    getTabletOrderPrice(tableInfo) {
      const tabletOrderPrice = tableInfo.TabletOrderPrice || 0;
      const tabletOrderPriceToLocaleString = tabletOrderPrice.toLocaleString();

      if(this.standardPriceFrontPosition) {
        return `${this.standardPriceUnit}${tabletOrderPriceToLocaleString}`;
      } else {
        return `${tabletOrderPriceToLocaleString}${this.standardPriceUnit}`;
      }
    },
    getTabletCreditPrice(tableInfo) {
      const tabletCreditPrice = tableInfo.TabletCreditPrice || 0;
      const tabletCreditPriceToLocaleString = tabletCreditPrice.toLocaleString();
      if(this.standardPriceFrontPosition) {
        return `${this.standardPriceUnit}${tabletCreditPriceToLocaleString}`;
      } else {
        return `${tabletCreditPriceToLocaleString}${this.standardPriceUnit}`;
      }
    },
    getTabletMisu(tableInfo) {
      const tabletMisu = tableInfo.TabletMisu || 0;
      const tabletMisuToLocaleString = tabletMisu.toLocaleString();

      if(this.standardPriceFrontPosition) {
        return `${this.standardPriceUnit}${tabletMisuToLocaleString}`;
      } else {
        return `${tabletMisuToLocaleString}${this.standardPriceUnit}`;
      }
    }
  },
  mounted() {
    this.tableStatusCheck();
  }
};
</script>

<style lang="scss" scoped>
.order-status-check-container {
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 1.5625vw !important;
  font-size: 1.71875vw;
  background-color: #fff;
  box-sizing: border-box;
  overflow: auto;

  .wrap-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .control-order-page-title {
      font-family: "notosans";
      font-weight: bold;
      font-size: 1.71875vw;
      padding: 1.5625vw 0 !important;
      box-sizing: border-box;
    }

    .refresh-robot {
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

  .wrap-table-name {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: center;
    gap: 0.78125vw;

    .table-name {
      min-height: 4.6875vw;
      display: flex;
      flex-direction: column;
      background-color: #e5e5e5;
      border: none;
      border-radius: 1.015625vw;
      font-family: 'Spoqa Han Sans Neo', 'sans-serif';
      font-size: 1.5625vw;
      color: #666;
      letter-spacing: -0.0390625vw;
      text-align: left;
      padding: 1.5625vw !important;
    }

    .table-red {
      background-color: #fc0000;
      color: #fff;
    }

    .table-blue {
      background-color: blue;
      color: #fff;
    }
  }
}
</style>