<template lang="pug">
.cancel-payment-order-page-container
  select-date-modal(
    v-if="selectDateModalVisible"
    :data="searchOptions.datetime"
    :selectDateModalSubmit="selectDateModalSubmit"
    :closeSearchModal="closeSearchModal"
  )
  select-table-modal(
    v-if="selectTableModalVisible"
    :data="searchOptions.table"
    :type="currentSearchModal"
    :toggleTable="toggleTable"
    :closeSearchModal="closeSearchModal"
  )
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
  .panel-show-table-wrap(v-if="panelType === 'table'")
    .panel-show-table
      button(:class="getTableBoxStyle(table)" v-for="table in tableStatusList" :key="table.tabletCode" @click="openCheckAlert(table)")
        p {{ getTableName(table) }}
        p {{ getStatusText(table) }}
  .panel-show-list(v-if="panelType === 'list'")
    .search-button-wrap
      button.search-button(@click.stop="openSearchModal('date')")
        p {{ displayDate }}
        icon-under-arrow
      button.search-button(@click.stop="openSearchModal('table')")
        p {{ displayTableName }}
        icon-under-arrow
      button.inquiry-button(@click="getPendingPaymentOrderList(1)")
        p 조회
    .data-table-wrap
      .fixed-pending-information-header
        p No
        p 테이블번호
        p 주문 요약
        p 주문금액
        p 결제 진행
        p 미수금
        p 결제 방식
        p 주문일시
        p 결제취소
      .pending-information-body
        .fixed-credit-information(v-for="pendingOrder in pendingOrderList" :key="pendingOrder.id")
          p {{ pendingOrder.no }}
          p {{ pendingOrder.tabletNumber }}
          p
            | {{ pendingOrder.startProductName }}
            span.space(v-if="isOtherProductSize(pendingOrder.otherProductSize)") 외 {{ pendingOrder.otherProductSize }}개
          p {{ getAmount(pendingOrder.totalAmount) }}
          p {{ getAmount(pendingOrder.completeAmount) }}
          p {{ getAmount(pendingOrder.balance) }}
          p {{ pendingOrder.paymentType }}
          p {{ pendingOrder.createdDatetime }}
          button.detail-button(@click="clickAndroidCallCancelPayment(pendingOrder)") 결제취소
    .wrap-pagination
      button.previous-button(v-if="showPageArrow" @click="clickPrevPage()") <
      button.page-block(
        v-for="num in pagination.list"
        :key="num"
        :class="getActivePageStyle(num)"
        @click="getPendingPaymentOrderList(num)"
        ) {{ num }}
      button.next-button(v-if="showPageArrow" @click="clickNextPage()") >
</template>

<script>
import { credit } from '@apis';
import { AlertModalTwoButton } from '@components';
import { RefreshBlackNewIcon } from '@svg';
const {
  requestPaymentPend,
  requestTabletStatus,
  requestPendingList,
  requestCreditWebLogs
} = credit;

export default {
  data() {
    return {
      tableStatusList: [],
      pendingOrderList: [],
      currentTable: {},
      panelType: 'table',
      doubleClick: false,
      timer: 0,
      //
      pageInfo: {
        currentPageNo: 0, // 현재페이지 (0)
        elementSizePerPage: 30, // 한 페이지당 할당되는 게시물 개수
        numberOfElement: 0, // 현재 페이지의 게시물 갯수
        totalElementCount: 0, // 총 검색 갯수
        totalPageCount: 0, // 총 페이지 수
      },
      pagination: {
        list: [],
        pageIndex: 0,
        size: 10,
        startPage: 0,
        endPage: 0,
      },
      currentSearchModal: '',
      selectStartDate: '',
      selectEndDate: '',
      searchOptions: {
        datetime: {
          start: new Date(),
          end: new Date(),
        },
        table: {
          list: [],
          selected: '',
        }
      },
    };
  },
  components: {
    AlertModalTwoButton,
    RefreshBlackNewIcon
  },
  computed: {
    // 페이지네이션 화살표
    showPageArrow() {
      return this.pageInfo.totalPageCount > this.pagination.size;
    },
    isAlertTwoBtModal() {
      return this.$store.state.isAlertTwoBtModal;
    },
    selectDateModalVisible() {
      return this.currentSearchModal === 'date';
    },
    selectTableModalVisible() {
      return this.currentSearchModal === 'table';
    },
    selectDate() {
      return this.selectStartDate && this.selectEndDate;
    },
    displayDate() {
      return this.selectDate ? `${this.selectStartDate.format('YYYY-MM-DD')} ~ ${this.selectEndDate.format('YYYY-MM-DD')}` : '날짜/시간별 조회';
    },
    displayTableName() {
      return this.searchOptions.table.selected ? this.searchOptions.table.selected : '테이블 번호';
    },
    tableNumValue() {
      return this.searchOptions.table.selected === '모든 테이블' ? '' : this.searchOptions.table.selected;
    },
  },
  methods: {
    // 페이지네이션
    loadPagination() {
      const { currentPageNo, totalPageCount } = this.pageInfo;
      const { pagination } = this;

      // 조회하려는 현재 페이지의 소속된 페이지 그룹 위치 계산
      pagination.pageIndex = Math.ceil(currentPageNo / pagination.size);

      // 페이지 10개 미만
      if (pagination.size > totalPageCount) {
        pagination.endPage = totalPageCount;

      // 페이지 10개 초과
      } else {
        if (pagination.pageIndex * Math.ceil(pagination.size / 2) < currentPageNo) {
          const half = currentPageNo + Math.ceil(pagination.size / 2);
          pagination.endPage = totalPageCount > half ? half : totalPageCount;
        } else {
          pagination.endPage = pagination.size;
        }
      }

      // 페이지 그룹의 첫 페이지
      pagination.startPage = pagination.endPage - (pagination.size - 1);
      if (pagination.startPage < 1) {
        pagination.startPage = 1;
      }

      // 현재 페이지 그룹만 배열로 생성
      pagination.list = [];
      for (let i = pagination.startPage; i <= pagination.endPage; i++) {
        pagination.list.push(i);
      }
    },
    clickNextPage() {
      if (this.pageInfo.totalPageCount > this.pageInfo.currentPageNo) {
        const plus = this.pageInfo.currentPageNo + 1;
        this.getPaysDetails(plus);
      }
    },
    clickPrevPage() {
      if (this.pageInfo.currentPageNo > 1) {
        const minus = this.pageInfo.currentPageNo - 1;
        this.getPaysDetails(minus);
      }
    },
    async initTables() {
      const params = { shop_code: this.$store.state.auth.store.store_code };
      await this.$store.dispatch('setTables', params);
      let tables = JSON.parse(JSON.stringify(this.$store.state.tables));
      tables.sort((a, b) => {
        return a.Tablet_name - b.Tablet_name;
      });

      tables.unshift({
        'Tablet_name': '모든 테이블',
      });

      this.searchOptions.table.list = tables;

    },
    pickerSelectToday() {
      this.searchOptions.datetime.start = this.$moment({ hour:0, minute:0 });
      this.searchOptions.datetime.end = this.$moment({ hour:23, minute:59 });
    },
    selectDateModalSubmit(date) {
      this.selectStartDate =  date.start;
      this.selectEndDate = date.end;
      this.searchOptions.datetime.start = date.start;
      this.searchOptions.datetime.end = date.end;
      this.closeSearchModal();
    },
    openSearchModal(name){
      this.currentSearchModal = name;
    },
    closeSearchModal() {
      this.$store.commit('updateItemModal', {
        currName: null,
        index: null,
      });
      this.currentSearchModal = null;
    },
    toggleTable(table) {
      this.searchOptions.table.selected = table.Tablet_name;
    },

    async getTabletsStatus() {
      try {
        const config = {
          storeCode: this.$store.state.auth.store.store_code,
        };

        const res = await requestTabletStatus(config);

        if (res.data.resultCode === 200) {
          this.tableStatusList = res.data.resultData.tabletStatusList;
        } else {
          return this.$store.commit('pushFlashMessage', '테이블 정보를 불러오는데 실패했습니다. 새로고침 해주시길 바랍니다.');
        }

      } catch (error) {
        console.log(error);
      }
    },
    async getPendingPaymentOrderList(page) {
      try {
        const config = {
          storeCode: this.$store.state.auth.store.store_code,
          tabletNumber: this.tableNumValue,
          startDatetime: this.$moment(this.searchOptions.datetime.start).format('YYYY-MM-DD HH:mm:ss'),
          endDatetime: this.$moment(this.searchOptions.datetime.end).format('YYYY-MM-DD HH:mm:ss'),
          page: page - 1,
          size: 30,
        };

        const res = await requestPendingList(config);
        if (res.data.resultCode === 200) {
          this.pendingOrderList = res.data.resultData.content;
          this.pageInfo.currentPageNo = res.data.resultData.currentPageNo + 1;
          this.pageInfo.elementSizePerPage = res.data.resultData.elementSizePerPage;
          this.pageInfo.numberOfElement = res.data.resultData.numberOfElement;
          this.pageInfo.totalElementCount = res.data.resultData.totalElementCount;
          this.pageInfo.totalPageCount = res.data.resultData.totalPageCount;

          this.loadPagination();
        } else {
          return this.$store.commit('pushFlashMessage', '보류 리스트를 불러오는데 실패했습니다. 새로고침 해주시길 바랍니다.');
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
          this.getTabletsStatus();
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
        return table.status === 'PAYING' ? '결제 진행 중' : '포스 접수 실패';
      }
      return '';
    },
    setPanelType(value) {
      document.querySelector('.tab-panel-list').scrollTop = 0;
      this.panelType = value;
    },
    clickRefresh() {
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

      if (this.panelType === 'table') {
        this.getTabletsStatus();
      }
      if (this.panelType === 'list') {
        this.getPendingPaymentOrderList(1);
      }
    },
    getActivePageStyle(current) {
      return {
        'page-number': true,
        'pagination-active': this.pageInfo.currentPageNo === current,
      };
    },
    getAmount(amount) {
      if (amount) {
        return amount.toLocaleString();
      }
      return 0;
    },
    isOtherProductSize(size) {
      return size > 0;
    },
    clickAndroidCallCancelPayment(order) {
      const orderKey = order.orderKey;

      if (window.UUID) {
        window.UUID.cancelPaymentPending(orderKey);
        this.postCreditWeblogFromAndroid(orderKey, order.tabletCode);
      }
    },
    async postCreditWeblogFromAndroid(orderKey, tabletCode) {
      try {
        const config = {
          orderKey,
          status: 'SEND_PENDING_ORDER_KEY_TO_ANDROID',
          store: {
            storeCode: this.$store.state.auth.store.store_code,
            tabletCode,
          }
        };

        await requestCreditWebLogs(config);
      } catch (error) {
        console.log(error);
      }
    },
    catchCancelPaymentSuccess() {
      window.addEventListener('message', (event) => {
        try {
          const msg = event?.data;
          const methodName = msg?.methodName;

          if (methodName === 'pendPaymentResult') {
            this.getPendingPaymentOrderList(1);
          }
        } catch (error) {
          console.log(error);
        }
      });
    }
  },
  mounted() {
    // 매장 테이블리스트 조회 API(검색용)
    this.initTables();
    // 오늘 날짜 선택
    this.pickerSelectToday();
    // 결제 보류 테이블상태 조회
    this.getTabletsStatus();
    // 결제 보류 주문건 조회
    this.getPendingPaymentOrderList(1);
    // 안드로이드 결제취소완료 수신
    this.catchCancelPaymentSuccess();
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


  .panel-show-table-wrap {
    background-color: #fff;
    height: 100%;
    overflow-y: scroll;

  .panel-show-table {
    display: grid;
    grid-template-columns: repeat(5, minmax(140px, auto));
    align-items: center;
    gap: 0.78125vw;
    padding: 1.5625vw !important;
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


  .panel-show-list {
    padding: 1.5625vw !important;
    background-color: #fff;
    .search-button-wrap {
      display: grid;
      align-items: center;
      grid-template-columns: 19.8438vw 13.2813vw 7.8125vw;
      gap: 0.8594vw;
      box-sizing: border-box;

      .search-button {
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        font-size: 1.25vw;
        letter-spacing: -0.03125vw;
        height: 3.515625vw;
        padding: 0 1.171875vw !important;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: none;
        border-radius: 0.390625vw;
        background-color: #e5e5e5;
      }

      .inquiry-button {
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        font-size: 1.25vw;
        letter-spacing: -0.03125vw;
        height: 3.515625vw;
        width: auto;
        padding: 0 1.171875vw !important;
        display: flex;
        align-items: center;
        border: none;
        border-radius: 0.390625vw;
        color: #fff;
        justify-content: center;
        background-color: #fc0000;
      }
    }

    .data-table-wrap {
      position: relative;
      height: 40.3906vw;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      border-top: solid 0.078125vw #ccc;
      margin-top: 1.5625vw !important;

      .fixed-pending-information-header {
        display: grid;
        grid-template-columns: 2.6563vw 3.9063vw 20.1563vw 4.2969vw 4.2969vw 4.2969vw 7.8125vw 7.8125vw 7.4219vw;
        justify-content: space-between;
        align-items: center;
        border-bottom: solid 0.078125vw #ccc;

        > p {
          height: 4.375vw;
          font-family: 'Spoqa Han Sans Neo', 'sans-serif';
          font-size: 1.09375vw;
          color: #666;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
        }
      }

      .pending-information-body {
        overflow-y: scroll;
        .fixed-credit-information {
          display: grid;
          grid-template-columns: 2.6563vw 3.9063vw 20.1563vw 4.2969vw 4.2969vw 4.2969vw 7.8125vw 7.8125vw 7.4219vw;
          column-gap: 0.3906vw;
          justify-content: space-between;
          align-items: center;
          border-bottom: 0.0781vw solid #ccc;
          justify-items: center;

          > p, span {
            min-height: 4.375vw;
            font-family: 'Spoqa Han Sans Neo', 'sans-serif';
            font-size: 1.25vw;
            font-weight: 500;
            color: #000;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
          }

          .space {
            margin-left: 0.2344vw !important;
          }

          .fail-text {
            color: #fc0000;
          }
          .check-payment {
            font-family: 'Spoqa Han Sans Neo', 'sans-serif';
            font-size: 1.25vw;
            letter-spacing: -0.03125vw;
            color: #fc0000;
            width: 100%;
            height: 2.8125vw;
            background-color: #fff;
            border: solid 0.078125vw #fc0000;
            border-radius: 0.390625vw;
          }

          .detail-button {
            font-family: 'Spoqa Han Sans Neo', 'sans-serif';
            font-size: 1.0938vw;
            letter-spacing: -0.03125vw;
            color: #fff;
            width: 5.9375vw;
            height: 2.8125vw;
            background-color: #000;
            border: solid 0.078125vw #000;
            border-radius: 0.390625vw;
          }
        }

        .cash-cancel-row-bg {
          background-color: #ffdada;
          border-bottom: 0.0781vw solid #fff;
        }

        .cash-confirm-row-bg {
          background-color: #cbd4ff;
          border-bottom: 0.0781vw solid #fff;

        }

        .none-data {
          font-family: 'Spoqa Han Sans Neo', 'sans-serif';
          font-size: 1.0938vw;
          font-weight: 500;
          color: #000;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 1.5625vw !important;
        }
      }
    }
    .wrap-pagination {
      height: 5vw;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.78125vw;

      .page-block {
        width: 2.65625vw;
        height: 2.65625vw;
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        font-size: 1.25vw;
        color: #12151d;
        background-color: #fff;
        border: solid 0.078125vw #ccc;
        border-radius: 0.390625vw;
      }

      .pagination-active {
        color: #fff;
        background-color: #000;
      }

      .previous-button,
      .next-button {
        width: 2.65625vw;
        height: 2.65625vw;
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2vw;
        font-weight: 400;
        color: #12151d;
        background-color: #fff;
        border: solid 0.078125vw #ccc;
        border-radius: 0.390625vw;
      }
    }
  }
}
</style>