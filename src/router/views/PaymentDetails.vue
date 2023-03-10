<template lang="pug">
.payment-details-container
  select-date-modal(
    v-if="selectDateModalVisible"
    :data="searchOptions.datetime"
    :selectDateModalSubmit="selectDateModalSubmit"
    :closeSearchModal="closeSearchModal"
  )
  vertical-long-modal(
    v-if="verticalModalVisible"
    :data="searchOptions[currentSearchModal]"
    :type="currentSearchModal"
    :selectOption="selectOption"
    :closeSearchModal="closeSearchModal"
  )
  select-table-modal(
    v-if="selectTableModalVisible"
    :data="searchOptions.table"
    :type="currentSearchModal"
    :toggleTable="toggleTable"
    :closeSearchModal="closeSearchModal"
  )
  p.payment-management-title 결제내역
  .payment-type-button-list
    button.search-button(@click.stop="openSearchModal('date')")
      p {{ displayDate }}
      icon-under-arrow
    button.search-button(@click.stop="openSearchModal('paymentMethod')")
      p {{ displayPaymentMethod() }}
      icon-under-arrow
    button.search-button(@click.stop="openSearchModal('paymentStatus')")
      p {{ displayPaymentStatus() }}
      icon-under-arrow
    button.search-button(@click.stop="openSearchModal('table')")
      p {{ displayTableName }}
      icon-under-arrow
    button.inquiry-button(@click="getPaysDetails(1)")
      p 조회
  .wrap-credit-information-table
    .fixed-credit-information-header
      p No
      p 테이블번호
      p 결제 유형
      p 결제 상태
      p 결제 확인
      p 결제 금액
      p 카드사명
      p 카드 번호
      p 결제 일시
      p 주문접수 상태
      p 자세히
    .credit-info-wrap
      .fixed-credit-information(v-for="payment in paymentList" :key="payment.id")
        p {{ payment.no }}
        p {{ payment.tabletNumber }}
        p {{ payment.paymentMethod }}
        p {{ payment.paymentStatus }}
        p(v-if="!payment.paymentConfirmation") {{ getPaymentConfirm(payment.paymentConfirmation) }}
        button.check-payment(v-else) {{ getPaymentConfirm(payment.paymentConfirmation) }}
        p {{ payment.amount.toLocaleString() }}
        p {{ payment.acquirer }}
        p {{ payment.cardNumber }}
        p {{ payment.approvalDatetime }}
        p {{ payment.orderStatus }}
        button.detail-button 자세히
  .wrap-pagination
    button.previous-button(v-if="showPageArrow" @click="clickPrevPage()") <
    button.page-block(
      v-for="num in pagination.list"
      :key="num"
      :class="getActivePageStyle(num)"
      @click="getPaysDetails(num)"
      ) {{ num }}
    button.next-button(v-if="showPageArrow" @click="clickNextPage()") >

</template>

<script>
import { credit } from '@apis';
const { requestPayDetails } = credit;

export default {
  data() {
    return {
      paymentList: [],
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
      searchOptions: {
        datetime: {
          start: new Date(),
          end: new Date(),
        },
        paymentMethod: {
          name: '결제 유형',
          selected: '',
          list: [
            {
              name: '전체',
              value: 'ALL'
            },
            {
              name: '카드',
              value: 'CARD'
            },
            {
              name: '현금',
              value: 'CASH'
            }
          ]
        },
        paymentStatus: {
          name: '결제 상태',
          selected: '',
          list: [
            {
              name: '전체',
              value: 'ALL'
            },
            {
              name: '승인',
              value: 'APPROVAL'
            },
            {
              name: '취소',
              value: 'CANCEL'
            },
            {
              name: '미수',
              value: 'MISU'
            }
          ],
        },
        table: {
          list: [],
          selected: '',
        }
      },
      selectStartDate: '',
      selectEndDate: '',
      currentSearchModal: '',
    };
  },
  computed: {
    // 페이지네이션 화살표
    showPageArrow() {
      return this.pageInfo.totalPageCount > this.pagination.size;
    },
    selectDateModalVisible() {
      return this.currentSearchModal === 'date';
    },
    verticalModalVisible() {
      return this.currentSearchModal === 'paymentMethod' || this.currentSearchModal === 'paymentStatus' ;
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
    paymentMethodValue() {
      return this.searchOptions.paymentMethod.selected === 'ALL' ? '' : this.searchOptions.paymentMethod.selected;
    },
    paymentStatusValue() {
      return this.searchOptions.paymentStatus.selected === 'ALL' ? '' : this.searchOptions.paymentStatus.selected;
    },
  },
  methods: {
    getPaymentConfirm(paymentConfirmation) {
      return paymentConfirmation ? paymentConfirmation : '-';
    },
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
    async getPaysDetails(page) {
      try {
        const config = {
          page: page - 1,
          size: 1,
          storeCode: this.$store.state.auth.store.store_code,
          tabletNumber: this.tableNumValue,
          paymentMethod: this.paymentMethodValue,
          paymentStatus: this.paymentStatusValue,
          startDatetime: this.$moment(this.searchOptions.datetime.start).format('YYYY-MM-DD HH:mm:ss'),
          endDatetime: this.$moment(this.searchOptions.datetime.end).format('YYYY-MM-DD HH:mm:ss'),
        };
        const res = await requestPayDetails(config);
        if (res.data.resultCode === 200) {
          this.paymentList = res.data.resultData.content;
          this.pageInfo.currentPageNo = res.data.resultData.currentPageNo + 1;
          this.pageInfo.elementSizePerPage = res.data.resultData.elementSizePerPage;
          this.pageInfo.numberOfElement = res.data.resultData.numberOfElement;
          this.pageInfo.totalElementCount = res.data.resultData.totalElementCount;
          this.pageInfo.totalPageCount = res.data.resultData.totalPageCount;

          this.loadPagination();
        }
      } catch (error) {
        console.log(error);
      }
    },
    getActivePageStyle(current) {
      return {
        'page-number': true,
        'pagination-active': this.pageInfo.currentPageNo === current,
      };
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
    selectDateModalSubmit(date) {
      this.selectStartDate =  date.start;
      this.selectEndDate = date.end;
      this.searchOptions.datetime.start = date.start;
      this.searchOptions.datetime.end = date.end;
      this.closeSearchModal();
    },
    pickerSelectToday() {
      this.searchOptions.datetime.start = this.$moment({ hour:0, minute:0 });
      this.searchOptions.datetime.end = this.$moment({ hour:23, minute:59 });
    },
    toggleTable(table) {
      this.searchOptions.table.selected = table.Tablet_name;
    },
    selectOption(_type, index) {
      this.searchOptions[_type].selected = this.searchOptions[_type].list[index].value;
      this.closeSearchModal();
    },
    displayPaymentMethod() {
      if (this.searchOptions.paymentMethod.selected) {
        const find = this.searchOptions.paymentMethod.list.find(item => item.value === this.searchOptions.paymentMethod.selected);
        return find.name;
      }
      return '결제 유형';
    },
    displayPaymentStatus() {
      if (this.searchOptions.paymentStatus.selected) {
        const find = this.searchOptions.paymentStatus.list.find(item => item.value === this.searchOptions.paymentStatus.selected);
        return find.name;
      }
      return '결제 상태';
    },
  },
  mounted() {
    // 테이블리스트 조회 API
    this.initTables();
    // 오늘 날짜 선택
    this.pickerSelectToday();
    // 결제내역 조회 API
    this.getPaysDetails(1);
  },
};
</script>

<style lang="scss" scoped>
.payment-details-container {
  flex: 1;
  background-color: #fff;
  padding: 0 1.5625vw !important;

  .payment-management-title {
    font-family: "notosans";
    font-weight: bold;
    font-size: 1.71875vw;
    padding: 1.5625vw 0 !important;
    box-sizing: border-box;
  }

  .payment-type-button-list {
    display: grid;
    align-items: center;
    grid-template-columns: 18.75vw 12.1875vw 12.1875vw 12.1875vw 7.8125vw;
    gap: 0.390625vw;
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

  .wrap-credit-information-table {
    position: relative;
    height: calc(100vh - 15.875025vw);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    border-top: solid 0.078125vw #ccc;
    margin-top: 1.5625vw !important;

    .fixed-credit-information-header {
      display: grid;
      grid-template-columns: 2.6563vw 3.9063vw 2.3438vw 3.0469vw 11.71875vw 4.2969vw 9.3750vw 6.2500vw 6.2500vw 6.5625vw 4.6875vw;
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

    .credit-info-wrap {
      overflow-y: scroll;
      .fixed-credit-information {
      display: grid;
      grid-template-columns: 2.6563vw 3.9063vw 2.3438vw 3.0469vw 11.71875vw 4.2969vw 9.3750vw 6.2500vw 6.2500vw 6.5625vw 4.6875vw;
      column-gap: 5px;
      justify-content: space-between;
      align-items: center;

      > p {
        min-height: 4.375vw;
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        font-size: 1.09375vw;
        color: #666;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
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
        font-size: 1.25vw;
        letter-spacing: -0.03125vw;
        color: #fff;
        width: 100%;
        height: 2.8125vw;
        background-color: #000;
        border: solid 0.078125vw #000;
        border-radius: 0.390625vw;
      }

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
</style>
