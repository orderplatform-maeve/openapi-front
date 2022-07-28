<template lang="pug">
.table-credit-info-list-container
  order-credit-history-modal(
    v-if="isVisibleOrderCreditHistoryModal"
    :creditInformationList="creditInformationList"
    :closeModal="offOrderCreditHistoryModal"
  )
  .wrap-table-name
    p.table-name 테이블 이름: {{getTableName}}
    .wrap-action-button
      button.action-button 주문정보삭제
      button.action-button 미수금처리
    .wrap-close-button(@click="closePage")
      close-text
  .wrap-credit-info-modal
    .wrap-table-credit-info(
      v-for="(creditInfo, firstIndex) in tableCreditInfo"
      :key="getOrderKey(creditInfo)"
    )
      .wrap-order-info
        .order-info
          p.order-time 주문 시간: {{getOrderTime(creditInfo)}}
          p.order-key 주문 키: {{getOrderKey(creditInfo)}}
        button.order-history-on(@click="onOrderCreditHistoryModal(getOrderKey(creditInfo))") 결제정보 보기
      .wrap-order-detail-info
        .order-detail-info(
          v-for="(detailInfo, secondIndex) in getOrderDetailInfo(creditInfo)"
          :key="getOrderDetailKey(firstIndex, secondIndex)"
        )
          p.order-detail-time 요청 시간: {{getOrderDetailTime(detailInfo)}}
          p.order-detail-status 요청 내용: {{getOrderDetailStatus(detailInfo)}}
</template>

<script>
import {
  CloseText
} from '@svg';

import {
  payments
} from '@apis';

import {
  OrderCreditHistoryModal
} from '@components';

const {
  getTableCreditInfo,
  getCreditOrderKeyList,
} = payments;

export default {
  components: {
    CloseText,
    OrderCreditHistoryModal,
  },
  data() {
    return {
      tableInfo: JSON.parse(this.$route.query.tableInfo),
      tableCreditInfo: [],
      isVisibleOrderCreditHistoryModal: false,
      creditInformationList: [],
    };
  },
  computed: {
    getTableName() {
      const tableName = this.tableInfo?.tableName || '';

      return tableName;
    }
  },
  methods: {
    async initCreditInfo() {
      try {
        const {
          storeCode,
          tableName,
          tableId
        } = this.tableInfo;
        const res = await getTableCreditInfo(storeCode, tableName, tableId);
        this.tableCreditInfo = res.data;
      } catch(error) {
        console.log(error);
      }
    },
    getOrderKey(creditInfo) {
      const {
        orderKey
      } = creditInfo;

      return orderKey;
    },
    getOrderTime(creditInfo) {
      const {
        time
      } = creditInfo;

      return time;
    },
    getOrderDetailInfo(creditInfo) {
      const orderDetailInfo = creditInfo.data || [];

      return orderDetailInfo;
    },
    getOrderDetailKey(firstIndex, secondIndex) {
      const orderDetailKey = `order-detail-key:${firstIndex}-${secondIndex}`;

      return orderDetailKey;
    },
    getOrderDetailTime(detailInfo) {
      const {
        dateTime
      } = detailInfo;

      return dateTime;
    },
    getOrderDetailStatus(detailInfo) {
      const {
        ment
      } = detailInfo;

      return ment;
    },
    async onOrderCreditHistoryModal(orderKey) {
      const {
        storeCode,
      } = this.tableInfo;

      const res = await getCreditOrderKeyList(storeCode, orderKey);
      this.creditInformationList = res.data || [];
      this.isVisibleOrderCreditHistoryModal = true;
    },
    offOrderCreditHistoryModal() {
      this.isVisibleOrderCreditHistoryModal = false;
      this.creditInformationList = [];
    },
    closePage() {
      const isCurrentOrderStatusCheckPage = this.$route.path === '/orderStatusCheck';

      if (isCurrentOrderStatusCheckPage) {
        return;
      }

      this.$router.push({
        name: 'orderStatusCheck',
      });
    }
  },
  mounted() {
    this.initCreditInfo();
  },
};
</script>

<style lang="scss" scoped>
.table-credit-info-list-container {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: #302a26;
  z-index: 10;
  padding: 1.953125vw !important;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .wrap-table-name {
    padding: 0.390625vw 0 1.5625vw !important;
    box-sizing: border-box;
    font-family: "notosans";
    font-weight: bold;
    font-size: 2.5vw;
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .wrap-close-button {
      display: flex;
      align-items: center;
    }

    .wrap-action-button {
      display: flex;
      align-items: center;
      gap: 2.34375vw;
      .action-button {
        height: 5vw;
        background-color: #fff;
        border-radius: 0.78125vw;
        border: none;
        font-family: "notosans";
        color: #000;
        font-weight: bold;
        font-size: 3.125vw;
        padding: 0 2.34375vw;
      }
    }
  }

  .wrap-credit-info-modal {
    width: 100%;
    flex: 1 1 0;
    background-color: #fff;
    border-radius: 1.5625vw;
    border: solid 0.078125vw #707070;
    overflow: auto;
    padding: 1.5625vw !important;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 1.5625vw;

    .wrap-table-credit-info {
      font-family: 'Spoqa Han Sans Neo', 'sans-serif';
      border: solid 0.078125vw #999;
      padding: 0.78125vw !important;
      box-sizing: border-box;
      border-radius: 0.78125vw;

      .wrap-order-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .order-info {
          .order-time {
            font-size: 1.953125vw;
            font-weight: bold;
          }

          .order-key {
            font-size: 1.953125vw;
          }
        }

        .order-history-on {
          height: 5.625vw;
          padding: 0 2.34375vw;
          font-family: 'Spoqa Han Sans Neo', 'sans-serif';
          font-size: 3.125vw;
          font-weight: bold;
          background-color: #000;
          color: #fff;
          border: none;
          border-radius: 0.78125vw;
        }
      }


      .wrap-order-detail-info {
        margin-top: 0.78125vw !important;
        display: flex;
        flex-direction: column;
        gap: 0.78125vw;
        font-size: 1.5625vw;
      }
    }
  }
}
</style>