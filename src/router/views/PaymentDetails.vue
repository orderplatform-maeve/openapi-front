<template lang="pug">
.payment-details-container
  p.payment-management-title 결제내역
  .payment-type-button-list
    button.search-button
      p 날짜/시간별 조회
      icon-under-arrow
    button.search-button
      p 결제 유형
      icon-under-arrow
    button.search-button
      p 결제 상태
      icon-under-arrow
    button.search-button
      p 테이블 번호
      icon-under-arrow
    button.inquiry-button
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
      p 주문 일시
      p 자세히
    .fixed-credit-information(v-for="item in paymentList" :key="item.id")
      p {{ item.no }}
      p {{ item.tabletNumber }}
      p {{ item.paymentMethod }}
      p {{ item.paymentStatus }}
      button {{ item.paymentConfirmation }} 미수금
      p {{ item.amount }}
      p {{ item.acquirer }}
      p {{ item.cardNumber }}
      p {{ item.approvalDatetime }}
      p {{ item.orderStatus }}
      p {{ item.orderDatetime }}
      button 자세히
  .wrap-pagination
    button.previous-button
    button.page-number
    button.next-button

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
    };
  },
  computed: {
  },
  methods: {
    async getPaysDetails() {
      try {
        const config = {
          page : 0,
          size : 30,
          storeCode: this.$store.state.auth.store.store_code,
        };
        const res = await requestPayDetails(config);
        if (res.data.resultCode === 200) {
          this.paymentList = res.data.resultData.content;
          this.pageInfo.currentPageNo = res.data.resultData.currentPageNo;
          this.pageInfo.elementSizePerPage = res.data.resultData.elementSizePerPage;
          this.pageInfo.numberOfElement = res.data.resultData.numberOfElement;
          this.pageInfo.totalElementCount = res.data.resultData.totalElementCount;
          this.pageInfo.totalPageCount = res.data.resultData.totalPageCount;
          console.log(this.paymentList, this.pageInfo);
        }
      } catch (error) {
        console.log(error);
      }
    }
  },
  mounted() {
    this.getPaysDetails();
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
    overflow-y: auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    border-top: solid 0.078125vw #ccc;
    margin-top: 1.5625vw !important;

    .fixed-credit-information-header {
      /* display: flex;
      justify-content: space-between; */
      display: grid;
      grid-template-columns: 34px 50px 30px 39px 51px 53px 120px 80px 80px 84px 80px 51px;
      /* grid-template-columns: repeat(11, auto); */
      justify-content: space-between;
      border-bottom: solid 0.078125vw #ccc;

      > p {
        height: 4.375vw;
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        font-size: 1.09375vw;
        color: #666;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .fixed-credit-information {
      /* display: grid;
      grid-template-columns: 6.25vw 6.25vw 11.71875vw 9.375vw 7.8125vw 10.9375vw; */
      display: grid;
      grid-template-columns: 34px 50px 30px 39px 51px 53px 120px 80px 80px 84px 80px 51px;
      /* grid-template-columns: repeat(11, auto); */
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

      .status {
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;

        > button {
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
      }
    }
  }
  .wrap-pagination {
    height: 5vw;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.78125vw;

    > button {
      width: 2.65625vw;
      height: 2.65625vw;
      font-family: 'Spoqa Han Sans Neo', 'sans-serif';
      font-size: 1.25vw;
      color: #12151d;
      background-color: #fff;
      border: solid 0.078125vw #ccc;
      border-radius: 0.390625vw;
    }

    .paginationActive {
      color: #fff;
      background-color: #000;
    }

    .previous-button,
    .next-button {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 2vw;
      font-weight: 400;
    }
  }
}
</style>
