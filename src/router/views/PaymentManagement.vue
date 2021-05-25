<template lang="pug">
.list_box
  .popup.item.cashOutstanding(v-if="itemModal.currName == 'cashOutstanding'")
    p.tit 현금미결제
    .content
      .row
        .left
          dl
            dt 주문금액 :
            dd {{item.amount}}
          dl
            dt 승인번호 :
            dd {{item.paymentId}}
          dl
            dt 주문일시 :
            dd {{item.orderdateTime}}
        .right
          dl(v-for="p in item.orderInfo")
            dt
              .name {{p.display_name}}
              .option(v-if="p.option")
                div(v-for="option in p.option") {{option.display_name}} {{option.order_qty}}개

            dd {{p.good_qty}}개
      .row
        .message 테이블에서<br/>현금 수납이 확인되었습니까?
    .button-group
      .button(v-on:click.stop="closeItemModal") 닫기
      .button.on(v-on:click.stop="() => cashCommit(item)") 확인

  .popup.item.cancelCashPayment(v-if="itemModal.currName == 'cancelCashPayment'")
    .tit 현금결제 취소
    .content
      p 현금결제 환불 처리하시겠습니까?
    .button-group
      .button(v-on:click.stop="closeItemModal()") 닫기
      .button.on(v-on:click.stop="cashCancelCommit(item);") 확인

  .popup.item.cancelCreditCardPayment(v-if="itemModal.currName == 'cancelCreditCardPayment'")
    p.tit 신용카드 결제 취소
    .content
      dl
        dt 카드번호 :
        dd {{item.cardNumber}}
      dl
        dt 카드사명 :
        dd {{item.issuer}}
      dl
        dt 결제금액 :
        dd {{item.amount}}
      dl
        dt 할부개월 :
        dd {{item.ApprovalMonth}}
      dl
        dt 승인번호 :
        dd {{item.paymentId}}
      dl
        dt 승인일시 :
        dd {{item.creditDateTime}}
    .button-group
      .button(v-on:click.stop="closeItemModal()") 닫기
      .button.on(v-on:click.stop="() => cardCancelCommit(item)") 승인취소

  .popup.item.orderProductDetail(v-if="itemModal.currName == 'orderProductsDetail'")
    p.tit 주문상품 상세
    .content
      dl(v-for="p in item.orderInfo")
        dt {{p.display_name}}
        dd {{p.good_qty}}개
    .button-group
      .button(v-on:click.stop="closeItemModal()") 닫기

  .popup.dateSelect(v-if="currentSearchModal == 'type'")
    p.tit 주문/승인 선택
    ul.btn_list
      li(v-for="(value, name) in searchOptions.type.list")
        a(v-on:click.stop="selectOption('type', name)" v-bind:class="{on: searchOptions.type.selected == name}") {{value.name}}
  .popup.payment(v-if="currentSearchModal == 'method'")
    p.tit 결제방식 선택
    ul.btn_list
      li(v-for="(value, name) in searchOptions.method.list")
        a(v-on:click.stop="selectOption('method', name)" v-bind:class="{on: searchOptions.method.selected == name}") {{value.name}}
  .popup.sortCount(v-if="currentSearchModal == 'filter'")
    ul.btn_list
      li(v-for="(value, name) in searchOptions.filter.list")
        a(v-on:click.stop="selectOption('filter', name)" v-bind:class="{on: searchOptions.filter.selected == name}") {{value.name}}
  .popup.sortDate(v-if="currentSearchModal == 'sort'")
    ul.btn_list
      li(v-for="(value, name) in searchOptions.sort.list")
        a(v-on:click.stop="selectOption('sort', name)" v-bind:class="{on: searchOptions.sort.selected == name}") {{value.name}}
  .popup.cardCompany(v-if="currentSearchModal == 'company'")
    p.tit 카드사 선택
    ul.list
      li(v-for="(value, name) in searchOptions.company.list")
        a(v-on:click.stop="selectOption('company', name)" v-bind:class="{on: searchOptions.company.selected == name}") {{value.name}}
  .popup.cardCompany(v-if="currentSearchModal == 'table'")
    p.tit 테이블 선택
    ul.list
      li(v-for="table in searchOptions.table.list")
        a(v-on:click.stop="toggleTable(table)"  v-bind:class="{'on': table.selected}") {{table.Tablet_name}}
    a.button-complete(v-on:click.stop="closeSearchModal()") 선택완료

  .popup.date(v-if="currentSearchModal == 'date'")
    p.tit 날짜/시간별 조회
    .left_box.fleft
      ul.quick_date.clearfix
        li
          a(v-on:click.stop="pickerSelectToday") 오늘
        li
          a(v-on:click.stop="pickerSelectWeek") 1주일
        li
          a(v-on:click.stop="pickerSelectMonth") 1개월
        li
          a(v-on:click.stop="pickerSelect3Months") 3개월
      dl.date_time.clearfix
        dt 시작일
        dd
          input(type='text' name='' v-bind:value="$moment(searchOptions.datetime.start).format('YYYY-MM-DD')" readonly v-on:click.stop="pickerSelectStartDate")
        dd
          input(type='text' name='' v-bind:value="$moment(searchOptions.datetime.start).format('HH')" readonly v-on:click.stop="pickerSelectStartHour")
          |  시
        dd
          input(type='text' name='' v-bind:value="$moment(searchOptions.datetime.start).format('mm')" readonly v-on:click.stop="pickerSelectStartMinute")
          |  분
      dl.date_time.clearfix
        dt 종료일
        dd
          input(type='text' name='' v-bind:value="$moment(searchOptions.datetime.end).format('YYYY-MM-DD')" readonly v-on:click.stop="pickerSelectEndDate")
        dd
          input(type='text' name='' v-bind:value="$moment(searchOptions.datetime.end).format('HH')" readonly v-on:click.stop="pickerSelectEndHour")
          |  시
        dd
          input(type='text' name='' v-bind:value="$moment(searchOptions.datetime.end).format('mm')" readonly v-on:click.stop="pickerSelectEndMinute")
          |  분
      a.select_done(v-on:click.stop="closeSearchModal()") 선택완료
    .right_box.fleft
      .date_select(v-if="['startHour', 'startMinute', 'endMinute', 'endHour'].includes(picker.selected)")
        ul.num
          li
            a(v-on:click.stop="pickerDownNumber") 이전
          li {{picker.number}}
          li
            a(v-on:click.stop="pickerUpNumber") 다음
        ul.keypad.clearfix
          li(v-on:click.stop="pickerSelectButton(1)") 1
          li(v-on:click.stop="pickerSelectButton(2)") 2
          li(v-on:click.stop="pickerSelectButton(3)") 3
          li(v-on:click.stop="pickerSelectButton(4)") 4
          li(v-on:click.stop="pickerSelectButton(5)") 5
          li(v-on:click.stop="pickerSelectButton(6)") 6
          li(v-on:click.stop="pickerSelectButton(7)") 7
          li(v-on:click.stop="pickerSelectButton(8)") 8
          li(v-on:click.stop="pickerSelectButton(9)") 9
          li.refresh(v-on:click.stop="pickerSelectButton('r')") 초기화
          li(v-on:click.stop="pickerSelectButton(0)") 0
          li.del(v-on:click.stop="pickerSelectButton('d')") 삭제
      .date_select(v-if="['startDate', 'enddate'].includes(picker.selected)")
        ul.month
          li
            a(v-on:click.stop="pickerPrevMonth") 이전
          li {{calendarYear}}년 {{calendarMonth}}월
          li
            a(v-on:click.stop="pickerNextMonth") 다음
        ul.weekdays
          li 월
          li 화
          li 수
          li 목
          li 금
          li 토
          li 일
        ul.days
          li(v-for="date in calendarFirstDayOfMonth")
          li(v-for="date in calendarDaysInMonth" v-bind:class="{'active': date == initialDate && calendarMonth == initialMonth && calendarYear == initialYear}" v-on:click.stop="pickerSelectDate(calendarYear, calendarMonth, date)") {{date}}

  .dimBg(v-if="currentSearchModal || itemModal.currName" v-on:click.stop="closeSearchModal()")

  //.search-modal(v-if="currentSearchModal")
    .search-modal-background(v-on:click.stop="closeSearchModal()")
    //.search-modal-content(v-if="currentSearchModal == 'type'")
      .title 주문/승인 선택
      .button-group
        .button(v-for="(value, name) in searchOptions.type.list" v-on:click.stop="selectOption('type', name)") {{value.name}}
        //.button(v-on:click.stop="selectType(2)") 현금승인날짜<br/>(현금영수증발행)
    //.search-modal-content(v-if="currentSearchModal == 'date'")
      .title 날짜/시간별 조회
      vc-date-picker(v-model='searchOptions.datetime' is-range  :masks="masks")
      .button-group
        .button(v-on:click="closeSearchModal();") 확인
    //.search-modal-content(v-if="currentSearchModal == 'method'")
      .title 결제방식 선택
      .button-group
        .button(v-for="(value, name) in searchOptions.method.list" v-on:click.stop="selectOption('method', name)") {{value.name}}
    //.search-modal-content(v-if="currentSearchModal == 'company'")
      .title 카드사 선택
      .button-group.company
        .button(v-for="(value, name) in searchOptions['company'].list" v-on:click.stop="selectOption('company', name)") {{value.name}}
    //.search-modal-content(v-if="currentSearchModal == 'table'")
      .title 테이블 선택(중복선택 가능)
      .table-group
        .table(v-for="table in searchOptions.table.list" v-on:click.stop="toggleTable(table)") {{table.Tablet_name}} {{table.selected}}
      .button(v-on:click.stop="closeSearchModal()") 선택완료
    //.search-modal-content(v-if="currentSearchModal == 'sort'")
      .button-group
        .button(v-for="(value, name) in searchOptions['sort'].list" v-on:click.stop="selectOption('sort', name); search();") {{value.name}}
    //.search-modal-content(v-if="currentSearchModal == 'filter'")
      .button-group
        .button(v-for="(value, name) in searchOptions['filter'].list" v-on:click.stop="selectOption('filter', name);  search();") {{value.name}}
  h1 결제내역(건별)
  .filter_wrap
    a.select(v-on:click.stop="openSearchModal('type')") {{optionName('type')}}
    a.select(v-on:click.stop="openSearchModal('date')") 날짜/시간별 조회
    a.select(v-on:click.stop="openSearchModal('method')") {{optionName('method')}}
    a.select(v-on:click.stop="openSearchModal('company')") {{optionName('company')}}
    a.select(v-on:click.stop="openSearchModal('table')") 테이블선택
    a.btn(v-on:click.stop="search()") 조회
  .sort_wrap
    a.sort(v-on:click.stop="openSearchModal('sort')") {{optionName('sort')}}
    a.sort(v-on:click.stop="openSearchModal('filter')") {{optionName('filter')}}
  #table-scroll.table_list
    table.main-table.clone
      colgroup
        col.col1
        col.col2
        col.col3
        col.col4
        col.col5
        col.col6
        //- col.col7
        //- col.col8
        //- col.col9
        //- col.col10
        //- col.col11
        //- col.col12
        //- col.col13
        //- col.col14
        //- col.col15
        //- col.col16
        //- col.col17
        //- col.col18
      thead
        tr
          th.fixed-side(scope='row') No
          th.fixed-side(scope='row') 테이블이름
          th.fixed-side(scope='row') 상태
          th.fixed-side(scope='row') 결제유형
          th.fixed-side(scope='row') 주문일시
          th.fixed-side(scope='row') 카드번호
          //- th(scope='row') 승인번호
          //- th(scope='row') 상품
          //- th(scope='row') 승인일시
          //- th(scope='row') 금액
          //- th(scope='row') 카드사명
          //- th(scope='row') 현금영수증 종류
          //- th(scope='row') 증빙방법
          //- th(scope='row') 결제방식
          //- th(scope='row') 할부개월
          //- th(scope='row') 부가세
          //- th(scope='row') 매입사명
          //- th(scope='row') 오류내용
      tbody
        tr(v-for="item in paymentList")
          td.fixed-side {{item.id}}
          td.fixed-side {{item.tableName}}
          td.fixed-side
            a.btn1(v-if="item.creditStat == 0" v-on:click.stop="openItemModal(item, 'cashOutstanding')") 현금미결제
            a.btn2(v-else-if="item.creditStat == 1" v-on:click.stop="openItemModal(item, 'cancelCashPayment')") 현금 결제 취소
            a.btn1(v-else-if="item.creditStat == 2" v-on:click.stop="openItemModal(item, 'cancelCreditCardPayment')") 결제 취소
            a.btn2(v-else-if="item.creditStat == 4") 카드 취소 완료
          td.fixed-side {{item.creditTypeString}}
          td.fixed-side {{item.orderdateTime}}
          td.fixed-side {{item.cardNumber}}
          //- td {{item.paymentId}}
          //- td {{item.creditDateTime}}
          //- td
          //- td {{item.amount}}
          //- td {{item.cardNumber}}
          //- td {{item.issuer}}
          //- td {{item.cashbillType}}
          //- td
          //- td {{item.creditTypeString}}
          //- td {{item.ApprovalMonth}}
          //- td {{item.vat}}
          //- td {{item.Acquirer}}
          //- td {{item.resultText}}
    .table-wrap
      table.main-table
        colgroup
          col.col1
          col.col2
          col.col3
          col.col4
          col.col5
          col.col6
          col.col7
          col.col8
          col.col9
          col.col10
          col.col11
          col.col12
          col.col13
          col.col14
          col.col15
          col.col16
          col.col17
          col.col18
        thead
          tr
            th.fixed-side(scope='row') No
            th.fixed-side(scope='row') 테이블이름
            th.fixed-side(scope='row') 상태
            th.fixed-side(scope='row') 결제유형
            th.fixed-side(scope='row') 주문일시
            th.fixed-side(scope='row') 카드번호
            th(scope='row') 승인번호
            th(scope='row') 승인일시
            //- th(scope='row') 상품
            th(scope='row') 금액
            th(scope='row') 카드사명
            th(scope='row') 현금영수증 종류
            th(scope='row') 증빙방법
            th(scope='row') 결제방식
            th(scope='row') 할부개월
            th(scope='row') 부가세
            th(scope='row') 매입사명
            th(scope='row') 오류내용
        tbody
          tr(v-for="item in paymentList")
            td.fixed-side {{item.id}}
            td.fixed-side {{item.tableName}}
            td.fixed-side
              a.btn1(v-if="item.creditStat == 0" v-on:click.stop="openItemModal(item, 'cashOutstanding')") 현금미결제
              a.btn2(v-else-if="item.creditStat == 1" v-on:click.stop="openItemModal(item, 'cancelCashPayment')") 현금 결제 취소
              a.btn1(v-else-if="item.creditStat == 2" v-on:click.stop="openItemModal(item, 'cancelCreditCardPayment')") 결제 취소
            td.fixed-side {{item.creditTypeString}}
            td.fixed-side {{item.orderdateTime}}
            td.fixed-side {{item.cardNumber}}
            td {{item.paymentId}}
            td {{item.creditDateTime}}
            //- td
              u(v-on:click.stop="openItemModal(item, 'orderProductsDetail')") {{productsName(item)}}
            td {{item.amount}}
            td {{item.issuer}}
            td {{item.cashbillType}}
            td
            td {{item.creditTypeString}}
            td {{item.ApprovalMonth}}
            td {{item.vat}}
            td {{item.Acquirer}}
            td {{item.resultText}}
  .pagination
    ul
      li.first-child(v-if="pagination.firstPage > 1")
        a(v-on:click="selectPage({number: pagination.firstPage-1})") 이전
      li(v-for="page in pagination.pages")
        a(v-bind:class="{'on': page.current}" v-on:click="selectPage(page)") {{page.number}}
      li.last-child(v-if="pagination.lastPage != pagination.maxPage")
        a(v-on:click="selectPage({number: pagination.lastPage+1})") 다음

//.payment-container
  .search-modal(v-if="currentSearchModal")
    .search-modal-background(v-on:click.stop="closeSearchModal()")
    .search-modal-content(v-if="currentSearchModal == 'type'")
      .title 주문/승인 선택
      .button-group
        .button(v-for="(value, name) in searchOptions.type.list" v-on:click.stop="selectOption('type', name)") {{value.name}}
        //.button(v-on:click.stop="selectType(2)") 현금승인날짜<br/>(현금영수증발행)
    .search-modal-content(v-if="currentSearchModal == 'date'")
      .title 날짜/시간별 조회
      vc-date-picker(v-model='searchOptions.datetime' is-range  :masks="masks")
      .button-group
        .button(v-on:click="closeSearchModal();") 확인
    .search-modal-content(v-if="currentSearchModal == 'method'")
      .title 결제방식 선택
      .button-group
        .button(v-for="(value, name) in searchOptions.method.list" v-on:click.stop="selectOption('method', name)") {{value.name}}
    .search-modal-content(v-if="currentSearchModal == 'company'")
      .title 카드사 선택
      .button-group.company
        .button(v-for="(value, name) in searchOptions['company'].list" v-on:click.stop="selectOption('company', name)") {{value.name}}
    .search-modal-content(v-if="currentSearchModal == 'table'")
      .title 테이블 선택(중복선택 가능)
      .table-group
        .table(v-for="table in searchOptions.table.list" v-on:click.stop="toggleTable(table)") {{table.Tablet_name}} {{table.selected}}
      .button(v-on:click.stop="closeSearchModal()") 선택완료
    .search-modal-content(v-if="currentSearchModal == 'sort'")
      .button-group
        .button(v-for="(value, name) in searchOptions['sort'].list" v-on:click.stop="selectOption('sort', name); search();") {{value.name}}
    .search-modal-content(v-if="currentSearchModal == 'filter'")
      .button-group
        .button(v-for="(value, name) in searchOptions['filter'].list" v-on:click.stop="selectOption('filter', name);  search();") {{value.name}}

  .default-modal(v-if="itemModal.currName")
    .default-modal-background(v-on:click.stop="closeItemModal()")
    .default-modal-content(v-if="itemModal.currName == 'cashOutstanding'")
      .title 현금미결제
      .content
        dl
          dt 주문금액
          dd {{item.amount}}
        dl
          dt 승인번호
          dd {{item.paymentId}}
        dl
          dt 주문일시
          dd {{item.orderdateTime}}
        .message 테이블에서<br/>현금 수납이 확인되었습니까?
      .button-group
        .button(v-on:click.stop="closeItemModal();") 닫기
        .button(v-on:click.stop="cashCommit(item);") 확인
    .default-modal-content(v-if="itemModal.currName == 'cancelCashPayment'")
      .title
        | 현금결제 취소
        .button-close X
      .content
        .message 현금결제 환불 처리하시겠습니까?
      .button-group
        .button(v-on:click.stop="cashCancelCommit(item);") 확인
        .button(v-on:click.stop="closeItemModal()") 취소
    .default-modal-content(v-if="itemModal.currName == 'cancelCreditCardPayment'")
      .title 신용카드 결제 취소
        //.button-close X
      .content
        dl
          dt 카드번호
          dd {{item.cardNumber}}
        dl
          dt 카드사명
          dd {{item.issuer}}
        dl
          dt 결제금액
          dd {{item.amount}}
        dl
          dt 할부개월
          dd {{item.ApprovalMonth}}
        dl
          dt 승인번호
          dd {{item.paymentId}}
        dl
          dt 승인일시
          dd {{item.creditDateTime}}
      .button-group
        .button(v-on:click.stop="closeItemModal()") 닫기
        .button(v-on:click.stop="cardCancelCommit") 승인취소

  .search-control
    .button(v-on:click.stop="openSearchModal('type')") {{optionName('type')}}
    .button(v-on:click.stop="openSearchModal('date')") {{searchOptions.datetime.start | moment("YYYY년 MM월 DD일") }} ~ {{searchOptions.datetime.end | moment("YYYY년 MM월 DD일")}}
    .button(v-on:click.stop="openSearchModal('method')") {{optionName('method')}}
    .button(v-on:click.stop="openSearchModal('company')") {{optionName('company')}}
    .button(v-on:click.stop="openSearchModal('table')") 테이블선택
    .button.button-submit(v-on:click.stop="search()") 조회
  .search-control
    .button(v-on:click.stop="openSearchModal('sort')") {{optionName('sort')}}
    .button(v-on:click.stop="openSearchModal('filter')") {{optionName('filter')}}

  .wrap-table()
    table
      thead
        tr
          th NO
          th 테이블번호
          th 상태
          th 결제유형
          th 주문일시
          th 승인번호
          th 승인일시
          th 금액
          th 카드번호
          th 카드사명
          th 현금영수증 종류
          th 증빙방법
          th 결제방식
          th 할부개월
          th 부가세
          th 매입사명
          th 오류내용
      tbody
        tr(v-for="item in items")
          td {{item.id}}
          td {{item.tableName}}
          td
            .button(v-if="item.creditStat == 0" v-on:click.stop="openItemModal(item, 'cashOutstanding')") 현금미결제
            .button(v-else-if="item.creditStat == 1" v-on:click.stop="openItemModal(item, 'cancelCashPayment')") 현금 결제 취소
            .button(v-else-if="item.creditStat == 2" v-on:click.stop="openItemModal(item, 'cancelCreditCardPayment')") 결제 취소
          td {{item.creditTypeString}}
          td {{item.orderdateTime}}
          td {{item.paymentId}}
          td {{item.creditDateTime}}
          td {{item.amount}}
          td {{item.cardNumber}}
          td {{item.issuer}}
          td {{item.cashbillType}}
          td
          td {{item.creditType}}
          td {{item.ApprovalMonth}}
          td {{item.vat}}
          td {{item.Acquirer}}
          td {{item.resultText}}
  .wrap-pagination
     .page(v-for="page in pagination.pages" v-bind:class="{'current': page.current}" v-on:click="selectPage(page)") {{page.number}}

</template>

<script>
//import paths from '@router/paths';
import { isDev } from '@utils/constants';
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
          name: '30개씩',
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
    };
  },
  computed: {
    itemModal() {
      return this.$store.state.itemModal;
    },
    paymentList() {
      return this.$store.state.paymentList;
    },
    paymentListPage() {
      return this.$store.state.paymentListPage;
    },
    calendarYear() {
      return this.picker.context.format('YYYY');
    },
    calendarMonth() {
      return this.picker.context.format('MM');
    },
    calendarDaysInMonth() {
      return this.picker.context.daysInMonth();
    },
    calendarFirstDayOfMonth: function () {
      let firstDay = this.$moment(this.picker.context).subtract((this.picker.context.get('date') - 1), 'days');
      return firstDay.weekday();
    },
    initialDate() {
      return this.picker.today.get('date');
    },
    initialMonth() {
      return this.picker.today.format('MM');
    },
    initialYear() {
      return this.picker.today.format('YYYY');
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

      await this.$store.dispatch('updatePaymentList', params);
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
    pickerSelectButton(k) {
      let tmp = 0;

      if (k=='r') {
        tmp = this.picker.numberRefeshTemp;
      } else if (k=='d') {
        let number = this.picker.number;
        let stringNumber = String(number);
        stringNumber = stringNumber.substr(0, stringNumber.length -1);

        if (stringNumber.length<1) stringNumber =0;

        tmp = parseInt(stringNumber);
      } else if (parseInt(k)) {
        let number = this.picker.number;
        let stringNumber = String(number);

        stringNumber+=k;
        if (stringNumber.length > 2) {
          stringNumber = stringNumber.substr(stringNumber.length -2, stringNumber.length -1);

        }
        tmp = parseInt(stringNumber);
      }


      if (this.picker.selected == 'startHour' || this.picker.selected == 'endHour') {
        if (tmp > 23) {
          tmp = 0;
        }
      } else {
        if (tmp > 59) {
          tmp = 0;
        }
      }


      this.picker.number = tmp;

      if (this.picker.selected == 'startHour') {
        this.searchOptions.datetime.start = this.$moment(this.searchOptions.datetime.start).set({ hour: tmp });
      } else if (this.picker.selected == 'endHour') {
        this.searchOptions.datetime.end = this.$moment(this.searchOptions.datetime.end).set({ hour: tmp });
      } else if (this.picker.selected == 'startMinute') {
        this.searchOptions.datetime.start = this.$moment(this.searchOptions.datetime.start).set({ minute: tmp });
      } else if (this.picker.selected == 'endMinute') {
        this.searchOptions.datetime.end = this.$moment(this.searchOptions.datetime.end).set({ minute: tmp });
      }

    },
    pickerUpNumber() {
      let tmp = this.picker.number;

      tmp = parseInt(tmp);
      tmp  += 1;

      if (this.picker.selected == 'startHour' || this.picker.selected == 'endHour') {
        if (tmp > 23) {
          tmp = 0;
        }
      } else {
        if (tmp > 59) {
          tmp = 0;
        }
      }

      this.picker.number = tmp;

      if (this.picker.selected == 'startHour') {
        this.searchOptions.datetime.start = this.$moment(this.searchOptions.datetime.start).set({ hour: tmp });
      } else if (this.picker.selected == 'endHour') {
        this.searchOptions.datetime.end = this.$moment(this.searchOptions.datetime.end).set({ hour: tmp });
      } else if (this.picker.selected == 'startMinute') {
        this.searchOptions.datetime.start = this.$moment(this.searchOptions.datetime.start).set({ minute: tmp });
      } else if (this.picker.selected == 'endMinute') {
        this.searchOptions.datetime.end = this.$moment(this.searchOptions.datetime.end).set({ minute: tmp });
      }
    },
    pickerDownNumber() {
      let tmp = this.picker.number;
      tmp = parseInt(tmp);

      tmp  -= 1;

      if (this.picker.selected == 'startHour' || this.picker.selected== 'endHour') {
        if (tmp < 0) {
          tmp = 23;
        }
      } else {
        if (tmp < 0) {
          tmp = 59;
        }
      }

      this.picker.number = tmp;

      if (this.picker.selected == 'startHour') {
        this.searchOptions.datetime.start = this.$moment(this.searchOptions.datetime.start).set({ hour: tmp });
      } else if (this.picker.selected == 'endHour') {
        this.searchOptions.datetime.end = this.$moment(this.searchOptions.datetime.end).set({ hour: tmp });
      } else if (this.picker.selected == 'startMinute') {
        this.searchOptions.datetime.start = this.$moment(this.searchOptions.datetime.start).set({ minute: tmp });
      } else if (this.picker.selected == 'endMinute') {
        this.searchOptions.datetime.end = this.$moment(this.searchOptions.datetime.end).set({ minute: tmp });
      }
    },
    pickerSelectStartHour() {
      let tmp = this.$moment(this.searchOptions.datetime.start).format('H');
      this.picker.number = tmp;
      this.picker.numberRefeshTemp = tmp;
      this.picker.selected = 'startHour';
    },
    pickerSelectEndHour() {
      let tmp = this.$moment(this.searchOptions.datetime.end).format('H');
      this.picker.number = tmp;
      this.picker.numberRefeshTemp = tmp;
      this.picker.selected = 'endHour';
    },
    pickerSelectStartMinute() {
      let tmp = this.$moment(this.searchOptions.datetime.start).format('m');
      this.picker.number = tmp;
      this.picker.numberRefeshTemp = tmp;
      this.picker.selected = 'startMinute';
    },
    pickerSelectEndMinute() {
      let tmp = this.$moment(this.searchOptions.datetime.end).format('m');
      this.picker.number = tmp;
      this.picker.numberRefeshTemp = tmp;
      this.picker.selected = 'endMinute';
    },
    pickerSelectStartDate() {
      this.picker.today = this.searchOptions.datetime.start;
      this.picker.context = this.searchOptions.datetime.start;
      this.picker.selected = 'startDate';
    },
    pickerSelectEndDate() {
      this.picker.today = this.searchOptions.datetime.end;
      this.picker.context = this.searchOptions.datetime.end;
      this.picker.selected = 'enddate';
    },
    pickerSelectDate(year, month, date) {
      month = parseInt(month) - 1;
      if (this.picker.selected == 'startDate') {
        this.searchOptions.datetime.start = this.$moment([year, month, date]);
        this.picker.today = this.searchOptions.datetime.start;

      } else if (this.picker.selected == 'enddate') {
        this.searchOptions.datetime.end = this.$moment([year, month, date]);
        this.picker.today = this.searchOptions.datetime.end;
      }
    },
    pickerSelectToday() {
      this.searchOptions.datetime.start = this.$moment({ hour:0, minute:0 });
      this.searchOptions.datetime.end = this.$moment({ hour:24, minute:0 });
    },
    pickerSelectWeek() {
      this.searchOptions.datetime.start = this.$moment({ hour:0, minute:0 }).subtract(1, 'week');
      this.searchOptions.datetime.end = this.$moment({ hour:24, minute:0 });
    },
    pickerSelectMonth() {
      this.searchOptions.datetime.start = this.$moment({ hour:0, minute:0 }).subtract(1, 'months');
      this.searchOptions.datetime.end = this.$moment({ hour:24, minute:0 });
    },
    pickerSelect3Months() {
      this.searchOptions.datetime.start = this.$moment({ hour:0, minute:0 }).subtract(3, 'months');
      this.searchOptions.datetime.end = this.$moment({ hour:24, minute:0 });
    },
    pickerPrevMonth() {
      this.picker.context = this.$moment(this.picker.context).subtract(1, 'months');
    },
    pickerNextMonth() {
      this.picker.context = this.$moment(this.picker.context).add(1, 'months');
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
    async cardCancelCommit(item) {
      try {
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

        if (isDev) {
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

<style lang="scss">
.payment-container {
  display:flex;
  flex-direction:column;
  flex-shrink:1;
  overflow:hidden;

  .wrap-table {
    display:flex;
    flex-direction:column;
    overflow:scroll;

    table {
      margin:1em;
      background-color:#fafafa;
      color:#202020;
      overflow:scroll;
        width:100%;

      thead {
        font-weight:900;

        th {
          padding: 0.5em 1em;
          white-space:nowrap;
          word-break: keep-all;
        }
      }
      tbody {
        td {
          padding: 0.5em 1em;
          white-space:nowrap;
          word-break: keep-all;

          .button {
            display:flex;
            align-items:center;
            justify-content:center;
            background-color:#202020;
            color:#fafafa;
            border-radius:1em;
            padding: 0.5em 1em;
          }
        }
      }
    }
  }

  .default-modal {
    position:fixed;
    top:0;
    bottom:0;
    left:0;
    right:0;
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:0;

    .default-modal-background {
      display:flex;
      background-color:rgba(0,0,0,0.5);
      position:fixed;
      left:0;
      top:0;
      right:0;
      bottom:0;
      z-index:1;
    }

    .default-modal-content {
      background-color:#fafafa;
      color:#202020;
      padding:1em;
      z-index:2;

      .title {
        display:flex;
        position:relative;
        flex-direction:row;
        border-bottom:solid 1px #cacaca;
        padding-bottom:0.5em;

        .button-close {
          display:flex;
          position:absolute;
          right:0;
          top:0;
        }
      }
      .message {
        display:flex;
        flex-direction:column;
        padding:0.5em 0;

        p {
          margin:0.5em 0;
        }
      }
      .button-group {
        display:flex;
        flex-direction:row;
        justify-content:space-between;

        .button {
          display:flex;
          flex-grow:1;
          height:3em;
          padding:0 2em;
          margin-right:1em;
          align-items:center;
          justify-content:center;
          background-color:#202020;
          color:#fafafa;
        }
        .button:last-child {
          margin-right:0;
        }
      }
    }
  }
  .search-modal {
    position:fixed;
    top:0;
    bottom:0;
    left:0;
    right:0;
    display:flex;
    align-items:center;
    justify-content:center;

    .search-modal-background {
      display:flex;
      background-color:rgba(0,0,0,0.5);
      position:fixed;
      left:0;
      top:0;
      right:0;
      bottom:0;
      z-index:1;
    }

    .search-modal-content {
      display:flex;
      flex-direction:column;
      z-index:2;
      background-color:#202020;
      border-radius:1.2em;
      border:solid 2px #848484;
      padding:1em;

      .title {
        color:#eaeaea;
      }

      .button-group {
        display:flex;
        flex-direction:column;
        .button {
          border-radius:0.4em;
          background-color:#fafafa;
          color:#202020;
          padding:1em 2em;
          margin-top:1em;
          align-items:center;
          justify-content:center;
          text-align:center;
          font-size:1em;
        }
      }
      .button-group.company {
        flex-direction:row;
        flex-wrap:wrap;

        .button {
          margin:0.5em;
        }
      }
    }
    .table-group {
      display:flex;
      flex-wrap:wrap;

      .table {
        display:flex;
        align-items:center;
        justify-contents:center;
        background-color:#eaeaea;
        color:#202020;
        padding:0.5em 1em;
        margin:0.5em;
      }
    }
  }
  .search-control {
    display:flex;
    margin:1em;

    .button {
      background-color:#fafafa;
      color:#202020;
      padding:0.5em 1em;
      margin-right:1em;
    }
    .button:last-child {
      margin-right:0;
    }
    .button.button-submit {
      background-color:#ff0000;
      color:#fafafa;
    }
  }
  .wrap-pagination {
    display:flex;
    align-items:center;
    justify-content:center;
    color:#fafafa;

    .page {
      font-size:1em;
      margin:0 1em;
      font-weight:100;
    }
    .page.current {
      font-weight:900;
      font-size:20px;
    }
  }
}
</style>
