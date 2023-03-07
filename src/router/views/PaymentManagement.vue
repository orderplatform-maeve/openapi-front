<template lang="pug">
.payment-management-container
  vertical-long-modal(
    v-if="verticalModalVisible"
    :data="searchOptions[currentSearchModal]"
    :type="currentSearchModal"
    :selectOption="selectOption"
    :closeSearchModal="closeSearchModal"
  )
  credit-company-list-modal(
    v-if="creditComponyModalVisible"
    :data="searchOptions[currentSearchModal]"
    :type="currentSearchModal"
    :selectOption="selectOption"
    :closeSearchModal="closeSearchModal"
  )
  select-table-modal(
    v-if="selectTableModalVisible"
    :data="searchOptions[currentSearchModal]"
    :type="currentSearchModal"
    :toggleTable="toggleTable"
    :closeSearchModal="closeSearchModal"
  )
  select-date-modal(
    v-if="selectDateModalVisible"
    :data="searchOptions.datetime"
    :selectDateModalSubmit="selectDateModalSubmit"
    :closeSearchModal="closeSearchModal"
  )
  credit-cancel-modal(
    v-if="cancelCreditCardPaymentModalVisible"
    :item="item"
    :closeItemModal="closeItemModal"
    :cardCancelCommit="cardCancelCommit"
  )
  cash-out-standing-modal(
    v-if="cashOutstandingModalVisibie"
    :item="item"
    :closeItemModal="closeItemModal"
    :cashCommit="cashCommit"
  )
  cancel-cash-payment-modal(
    v-if="cancelCashPaymentModalVisibie"
    :item="item"
    :closeItemModal="closeItemModal"
    :cashCancelCommit="cashCancelCommit"
  )
  p.payment-management-title 결제내역(건별)
  .payment-type-button-list
    button.order-date-type(@click.stop="openSearchModal('type')")
      p.select-button {{optionName('type')}}
      icon-under-arrow
    button.order-date(@click.stop="openSearchModal('date')")
      p.select-button {{displayDate}}
      icon-under-arrow
    button.payment-type(@click.stop="openSearchModal('method')")
      p.select-button {{optionName('method')}}
      icon-under-arrow
    button.payment-company(@click.stop="openSearchModal('company')")
      p.select-button {{optionName('company')}}
      icon-under-arrow
    button.table-number(@click.stop="openSearchModal('table')")
      p.select-button 테이블선택
      icon-under-arrow
    button.submit(@click.stop="search()") 조회
  .sort-type-button-list
    button.date-base(@click.stop="openSearchModal('sort')")
      p.select-button {{getSortedType}}
      icon-under-arrow(:black="true")
    button.count-base(@click.stop="openSearchModal('filter')")
      p.select-button {{searchOptions.filter.selected}}개씩
      icon-under-arrow(:black="true")
  .wrap-credit-information-list
    .wrap-fixed-credit-information
      .fixed-credit-information-list
        .fixed-credit-information-header
          p No
          p 테이블번호
          p 상태
          p 결제유형
          p 주문일시
          p 카드번호
        .fixed-credit-information(v-for="(item, index) in paymentList" :key="'index-'+index+'id-'+item.id")
          p {{item.id}}
          p {{item.tableName}}
          .status
            button.btn1(v-if="item.creditStat == 0" v-on:click.stop="openItemModal(item, 'cashOutstanding')") 현금미결제
            button.btn2(v-else-if="item.creditStat == 1" v-on:click.stop="openItemModal(item, 'cancelCashPayment')") 현금결제취소
            button.btn1(v-else-if="item.creditStat == 2" v-on:click.stop="openItemModal(item, 'cancelCreditCardPayment')") 결제 취소
            button.btn2(v-else-if="item.creditStat == 4") 카드 취소 완료
          p {{item.creditTypeString}}
          p {{item.orderdateTime}}
          p {{item.cardNumber}}
    .wrap-relative-credit-information
      .relative-credit-information-list
        .relative-credit-information-header
          p.header-payment-id 승인번호
          p 승인일시
          p 금액
          p 카드사명
          p 현금영수증 종류
          p 증빙방법
          p 결제방식
          p 할부개월
          p 부가세
          p 매입사명
          p 오류내용
        .relative-credit-information(v-for="(item, index) in paymentList" :key="'index-'+index+'id-'+item.id")
          p.payment-id {{item.paymentId}}
          p.payment-date {{item.creditDateTime}}
          p {{item.amount}}
          p {{item.issuer}}
          p {{item.cashbillType}}
          p
          p {{item.creditTypeString}}
          p {{item.ApprovalMonth}}
          p {{item.vat}}
          p {{item.Acquirer}}
          p {{item.resultText}}
  .wrap-pagination
    button.previous-button(v-if="pagination.firstPage > 1" v-on:click="selectPage({number: pagination.firstPage-1})") &lt;
    button.page-number(v-for="(page, index) in pagination.pages" :key="index" @click="selectPage(page)" :class="{paginationActive: page.current}") {{page.number}}
    button.next-button(v-if="pagination.lastPage != pagination.maxPage" v-on:click="selectPage({number: pagination.lastPage+1})") &gt;
</template>

<script>
//import paths from '@router/paths';
import { STOP_REDIRECT } from '@utils/constants';
import axios from 'axios';
import endpoints from '@apis/endpoints';

export default {
  components: {
  },
  data() {
    return {
      masks: {
        input: 'YYYY-MM-DD h:mm A',
      },
      page: {
        currPage: 3,
        allPages: 10,
      },
      // itemModal: {
      //   currName: null,
      //   item: null,
      // },
      picker: {
        today: null,
        context: null,
        number: null,
        numberRefeshTemp: null,
        selected: 'start',
      },
      currentSearchModal: null, //'type', 'date', 'method', 'company', 'table',
      searchOptions: {
        sort : {
          name: '최신순',
          selected: 'DESC',
          list: {
            'DESC':  {
              name: '최신순'
            },
            'ASC':  {
              name: '과거순',
            }
          }
        },
        filter : {
          name: '목록 갯수',
          selected: '30',
          list: {
            '30':  {
              name: '30개씩'
            },
            '50':  {
              name: '50개씩',
            },
            '100':  {
              name: '100개씩',
            },
            '200':  {
              name: '200개씩',
            },
            '500':  {
              name: '500개씩',
            },
            '1000':  {
              name: '1000개씩',
            },
          }
        },
        type: {
          name: '주문/승인',
          selected: null,
          list: {
            'order':  {
              name: '주문날짜'
            },
            'credit':  {
              name: '승인날짜',
            }
          }
        },
        datetime: {
          start: new Date(),
          end: new Date(),
        },
        method: {
          name: '결제방식',
          selected: 'all',
          list: {
            'all': {
              name: '전체',
            },
            'Card': {
              name: '카드결제',
            },
            'Cash': {
              name: '현금결제(완료)',
            },
            'Cash_outstanding': {
              name: '현금미결제',
            },
          },
        },
        company: {
          name: '카드사',
          selected: null,
          list: {
            'all': {
              name: '전체',
            },
            '01': {
              name: '비씨',
            },
            '02': {
              name: '국민',
            },
            '03': {
              name: '하나',
            },
            '04': {
              name: '삼성',
            },
            '05': {
              name: '신한',
            },
            '08': {
              name: '현대',
            },
            '09': {
              name: '롯데',
            },
            '11': {
              name: '한미',
            },
            '12': {
              name: '수협',
            },
            '13': {
              name: '신세계',
            },
            '14': {
              name: '우리',
            },
            '15': {
              name: 'NH',
            },
            '16': {
              name: '제주',
            },
            '17': {
              name: '광주',
            },
            '18': {
              name: '전북',
            },
            '24': {
              name: '하나',
            },
            '25': {
              name: '해외',
            },
            '26': {
              name: '씨티',
            },
          },
        },
        table: {
          list: [],
        }
      },
      items: [],
      selectStartDate: undefined,
      selectEndDate: undefined,
      // 이중 클릭 방지
      reRequest : false,
      timer : 0,
    };
  },
  computed: {
    selectDate() {
      return this.selectStartDate && this.selectEndDate;
    },
    displayDate() {
      return this.selectDate ? `${this.selectStartDate.format('YYYY-MM-DD')} ~ ${this.selectEndDate.format('YYYY-MM-DD')}` : '날짜/시간별 조회';
    },
    itemModal() {
      return this.$store.state.itemModal;
    },
    paymentList() {
      return this.$store.state.paymentList;
    },
    paymentListPage() {
      return this.$store.state.paymentListPage;
    },
    item() {
      return this.itemModal.item;
    },
    pagination() {
      const pageSize = 5;

      let currPage = this.$store.state.paymentListPage.currPage;
      let maxPage = this.$store.state.paymentListPage.allPages;

      let firstPage = currPage - pageSize;
      let lastPage = currPage + pageSize;

      if (firstPage < 1) {
        lastPage = lastPage + (-1 *(firstPage));
        firstPage = 1;
      } else if (lastPage > maxPage) {
        firstPage = firstPage + (maxPage - lastPage);

        lastPage = maxPage;
      }

      if (firstPage < 1) {
        firstPage = 1;
      }
      if (lastPage > maxPage) {
        lastPage = maxPage;
      }

      let pages = [];
      for (let i= firstPage; i<=lastPage; i++) {
        let current = false;
        if (i == currPage) current = true;
        pages.push({
          number: i,
          current: current,
        });
      }

      return {
        pages,
        firstPage,
        lastPage,
        maxPage,
      };
    },
    verticalModalVisible() {
      return this.currentSearchModal == 'type' || this.currentSearchModal == 'method' || this.currentSearchModal == 'sort' || this.currentSearchModal == 'filter';
    },
    creditComponyModalVisible() {
      return this.currentSearchModal == 'company';
    },
    selectTableModalVisible() {
      return this.currentSearchModal == 'table';
    },
    selectDateModalVisible() {
      return this.currentSearchModal == 'date';
    },
    cancelCreditCardPaymentModalVisible() {
      return this.itemModal.currName == 'cancelCreditCardPayment';
    },
    cashOutstandingModalVisibie() {
      return this.itemModal.currName == 'cashOutstanding';
    },
    cancelCashPaymentModalVisibie() {
      return this.itemModal.currName == 'cancelCashPayment';
    },
    getSortedType() {
      return this.searchOptions.sort.list[this.searchOptions.sort.selected].name;
    }
  },
  watch: {
  },
  mounted() {
    this.initTables();
    this.pickerSelectToday();
    this.updatePaymentList();

    this.picker.today = this.$moment();
    this.picker.context = this.$moment();
  },
  methods: {
    selectDateModalSubmit(date) {
      this.selectStartDate =  date.start;
      this.selectEndDate = date.end;
      this.searchOptions.datetime.start = date.start;
      this.searchOptions.datetime.end = date.end;
      this.closeSearchModal();
    },
    showAlert(message) {
      this.$store.commit('updateAlertModalMessage', message);
      return this.$store.commit('updateIsAlertModal', true);
    },
    async updatePaymentList(page) {
      if (!page)  page = 1;

      let selectedTables = [];
      this.searchOptions.table.list.map((table) => {
        if (table.selected) selectedTables.push(table.Ta_id);
      });

      const maskMoment = "YYYY-MM-DD HH:mm:ss";
      const params = {
        storeCode: this.$store.state.auth.store.store_code,
        dateType: this.searchOptions.type.selected,
        Filter: this.searchOptions.filter.selected,
        page: page,
        sort: this.searchOptions.sort.selected,
        startDate: this.$moment(this.searchOptions.datetime.start).format(maskMoment),
        endDate: this.$moment(this.searchOptions.datetime.end).format(maskMoment),
        paymentMethod: this.searchOptions.method.selected,
        issuerCode: this.searchOptions.company.selected,
        tables: selectedTables.join('@'),
        sst: 'id',
      };

      await this.$store.dispatch('updateOldPaymentList', params);
    },
    productsName(order) {
      let msg = '';
      if(order.orderInfo && order.orderInfo.length > 0) {
        let firstProduct = order.orderInfo[0];

        msg = firstProduct.display_name;

        if(order.orderInfo.length > 1) {
          msg += ' 외 '+order.orderInfo.length;
        }

      }

      return msg;
    },
    pickerSelectToday() {
      this.searchOptions.datetime.start = this.$moment({ hour:0, minute:0 });
      this.searchOptions.datetime.end = this.$moment({ hour:23, minute:59 });
    },
    async commit(item, url) {
      let data = new FormData();
      data.append('key', item.key);
      data.append('id', item.id);
      data.append('stat', item.creditStat);
      data.append('type',  item.creditType);
      data.append('storeCode', item.storeCode);
      data.append('tabletNumber', item.tabletnumber);
      data.append('tablename', item.tableName);
      data.append('orderKey', item.orderkey);
      return  await axios({
        method: 'post',
        url,
        data: data,
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    async cashCommit(item) {
      const url = endpoints.payment.cashCommit;
      const res = await this.commit(item, url);
      const newItem = res.data.rowData;
      console.log('newItem', res);
      this.$store.commit('replacePaymentListItem', newItem);

      this.$store.commit('UPDATE_ORDER_CREDIT', newItem, true);

      this.closeItemModal();
    },
    async cashCancelCommit(item) {
      const url = endpoints.payment.cashCancelCommit;
      const res = await this.commit(item, url);
      const newItem = res.data.rowData;
      this.$store.commit('replacePaymentListItem', newItem);
      this.closeItemModal();
    },
    // 승인취소
    async cardCancelCommit(item) {
      try {
        // 이중 클릭 방지
        if (this.reRequest) {
          console.log('이중 클릭 방지');
          return;
        }

        if (this.timer) {
          clearTimeout(this.timer);
        }

        this.timer = setTimeout(() => {
          this.reRequest = false;
          return;
        }, 10000);

        this.reRequest = true;

        console.log('cardCancelCommit', item);

        const paymentPayload = {
          installment: String(item.ApprovalMonth) === "0" ? "00" : item.ApprovalMonth, // 서버에 저장된 값에서 불러와야함
          amount: item.amount,
          payReqId: item.key,
          approvalDate: item.approvalDate, // timestemp
          paymentId: item.paymentId,
          approvalNumber: item.approvalNumber,
          deviceId: item.deviceId,
          storeCd: this.$store.state.auth.store.store_code,
          tableNo: item.tabletnumber,
          vanType: item.vanType,
          orderKey: item.orderkey,
        };
        console.log('paymentPayload', paymentPayload, item.orderkey);

        if (!item?.ApprovalMonth) {
          return this.showAlert(`ApprovalMonth(installment) 잘못된 형태입니다. 출력값: ${item.ApprovalMonth}`);
        }

        if (!item.amount) {
          return this.showAlert(`amount 잘못된 형태입니다. 출력값: ${item.amount}`);
        }

        if (!item.key) {
          return this.showAlert(`key(payReqId) 잘못된 형태입니다. 출력값: ${item.key}`);
        }

        if (!item.approvalDate) {
          return this.showAlert(`approvalDate 잘못된 형태입니다. 출력값: ${item.approvalDate}`);
        }

        if (!item.paymentId) {
          return this.showAlert(`paymentId 잘못된 형태입니다. 출력값: ${item.paymentId}`);
        }

        if (!item.deviceId) {
          return this.showAlert(`deviceId 잘못된 형태입니다. 출력값: ${item.deviceId}`);
        }

        if (!item.tabletnumber) {
          return this.showAlert(`tabletnumber(tableNo) 잘못된 형태입니다. 출력값: ${item.tabletnumber}`);
        }

        if (!item.vanType) {
          return this.showAlert(`vanType 잘못된 형태입니다. 출력값: ${item.vanType}`);
        }

        if (!item.orderkey) {
          return this.showAlert(`orderKey 잘못된 형태입니다. 출력값: ${item.orderKey}`);
        }

        if (!this.$store?.state?.auth?.store?.store_code) {
          return this.showAlert(`!store_code(storeCd) 잘못된 형태입니다. 출력값: ${this.$store?.state?.auth?.store?.store_code}`);
        }

        if (STOP_REDIRECT) {
          console.log('postMessage');
          return window.postMessage({
            methodName: 'callBackPayment',
            result: JSON.stringify({
              responseCode: '0000',
              amount: paymentPayload.amount,
              vat: 0,
              cardNumber: '655620**********',
              issuerCode: '0100',
              issuer: '우리카드',
              acquirerCode: '0100',
              acquirer: '비씨카드',
              paymentId: String(Math.floor(Math.random() * 1000000000000) + 1),
              approvalNumber: String(Math.floor(Math.random() * 100000000) + 1),
              approvalMonth: '00',
              approvalDate: '20201216113356',
              errorMessage: '',
              deviceId: paymentPayload.deviceId,
              storeCode: paymentPayload.storeCd,
              tableNo: paymentPayload.tableNo,
              payReqId: paymentPayload.payReqId,
              orderKey: paymentPayload.orderKey,
              approvalType: 'REFUND',
              order_type: 'credit',
              payment_method: 'Card',
              paymentDate: Date.now(),
              paymentCompany: paymentPayload.vanType,
              paymentResultUpload: 'N',
              orderPrice: 0,
              resultText: '',
            })
          }, 'http://localhost:8080');
        }

        if (window?.UUID) {
          console.log('call torderRefund', window.UUID.torderRefund);
          return window.UUID.torderRefund(
            paymentPayload.installment,
            paymentPayload.amount,
            paymentPayload.payReqId,
            paymentPayload.approvalDate,
            paymentPayload.paymentId,
            paymentPayload.approvalNumber,
            paymentPayload.deviceId,
            paymentPayload.storeCd,
            paymentPayload.tableNo,
            paymentPayload.vanType,
            paymentPayload.orderKey,
          );
        }
        return this.showAlert(`window.UUID 객체가 없습니다. 에러: ${window.UUID}`);
      } catch (error) {
        return this.showAlert(`cardCancelCommit 잘못된 형태입니다. 에러: ${error.message}`);
      }
    },
    selectPage(page) {
      const number = page.number;
      this.updatePaymentList(number);
    },
    toggleTable(table) {
      table.selected = !table.selected;
    },
    async initTables() {
      const params = { shop_code: this.$store.state.auth.store.store_code };
      await this.$store.dispatch('setTables', params);
      let tables = JSON.parse(JSON.stringify(this.$store.state.tables));

      tables.map((i) => {
        i.selected = false;
      });
      this.searchOptions.table.list = tables;
    },
    optionName(_type) {
      if (this.searchOptions[_type].selected) {
        const index = this.searchOptions[_type].selected;
        return this.searchOptions[_type].list[index].name;
      } else {
        return this.searchOptions[_type].name;
      }
    },
    selectOption(_type, index) {
      this.searchOptions[_type].selected = index;
      this.closeSearchModal();
    },
    openItemModal(item, name){
      if (name=='cashOutstanding') {
        // this.$store.commit('setRequestCashItem', item);
        this.$store.commit('updateItemModal', {
          item,
          currName: name,
        });
      } else {
        console.log('openItemModal', item, name);
        this.$store.commit('setRequestCreditItem', item);
        this.$store.commit('updateItemModal', {
          item,
          currName: name,
        });
      }
    },
    closeItemModal() {
      this.$store.commit('updateItemModal', {
        currName: null,
        index: null,
      });
      this.currentSearchModal = null;
    },
    openSearchModal(name){
      if (name == 'date') this.picker.selected = 'startDate';
      this.currentSearchModal = name;
    },
    closeSearchModal() {
      this.$store.commit('updateItemModal', {
        currName: null,
        index: null,
      });
      this.currentSearchModal = null;
    },
    search() {
      this.updatePaymentList(1);
    },
  },
};
</script>

<style lang="scss" scoped>
.payment-management-container {
  flex: 1;
  background-color: #fff;

  .payment-management-title {
    font-family: "notosans";
    font-weight: bold;
    font-size: 1.71875vw;
    padding: 1.5625vw !important;
    box-sizing: border-box;
  }

  .payment-type-button-list {
    padding: 0 1.5625vw !important;
    display: grid;
    align-items: center;
    grid-template-columns: 10.9375vw 18.75vw 12.1875vw 12.1875vw 12.1875vw 7.8125vw;
    gap: 0.390625vw;
    box-sizing: border-box;

    > button {
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

    .submit {
      color: #fff;
      justify-content: center;
      background-color: #fc0000;
    }
  }

  .sort-type-button-list {
    display: flex;
    align-items: center;
    gap: 0.78125vw;
    padding: 1.5625vw 1.5625vw 0.78125vw !important;

    > button {
      font-family: 'Spoqa Han Sans Neo', 'sans-serif';
      font-size: 1.25vw;
      background-color: unset;
      border: none;
      display: flex;
      align-items: center;
      gap: 0.9375vw;
      padding: 1.015625vw !important;
      box-sizing: border-box;
    }
  }

  .wrap-credit-information-list {
    position: relative;
    height: calc(100vh - 20.390625vw);
    overflow-y: auto;
    margin-left: 1.5625vw !important;
    box-sizing: border-box;
    display: flex;
    border-top: solid 0.078125vw #ccc;

    .wrap-fixed-credit-information {
      width: 52.34375vw;

      .fixed-credit-information-list {
        border-right: solid 0.078125vw #ccc;

        .fixed-credit-information-header {
          display: grid;
          grid-template-columns: 6.25vw 6.25vw 11.71875vw 9.375vw 7.8125vw 10.9375vw;
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
          }
        }
        .fixed-credit-information {
          display: grid;
          grid-template-columns: 6.25vw 6.25vw 11.71875vw 9.375vw 7.8125vw 10.9375vw;
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
    }

    .wrap-relative-credit-information {
      width: 30.1875vw;

      .relative-credit-information-list {
        overflow-y: hidden;
        .relative-credit-information-header {
          display: grid;
          grid-template-columns: 9.375vw 7.8125vw 7.8125vw 9.375vw 9.375vw 9.375vw 9.375vw 9.375vw 9.375vw 9.375vw 9.375vw;

          > p {
            height: 4.375vw;
            font-family: 'Spoqa Han Sans Neo', 'sans-serif';
            font-size: 1.09375vw;
            color: #666;
            display: flex;
            justify-content: center;
            align-items: center;
            border-bottom: solid 0.078125vw #ccc;
          }
        }
        .relative-credit-information {
          display: grid;
          grid-template-columns: 9.375vw 7.8125vw 7.8125vw 9.375vw 9.375vw 9.375vw 9.375vw 9.375vw 9.375vw 9.375vw 9.375vw;
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
            word-break: break-all;
            word-wrap: normal;
          }

          .payment-date {
           word-break: unset;
           word-wrap: unset;
          }
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
