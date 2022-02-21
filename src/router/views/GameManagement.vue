<template lang="pug">
  .game-management-container
    vertical-long-modal(
      v-if="verticalModalVisible"
      :data="searchOptions[currentSearchModal]"
      :type="currentSearchModal"
      :selectOption="selectOption"
      :closeSearchModal="closeSearchModal"
    )
    select-date-modal(
    v-if="selectDateModalVisible"
    :data="searchOptions.datetime"
    :selectDateModalSubmit="selectDateModalSubmit"
    :closeSearchModal="closeSearchModal"
    )
    p.game-management-title 게임관리
    .main-categories
      .main-category(
        :class="getActiveCtgStyle(item)"
        v-for="(item, index) in mainCategory"
        :key="getMainCategoryKey(index)"
        @click="getSelectMainCtg(item)"
        ) {{ item }}
    .background-white
      div(v-if="selectCategory === '진행내역'")
        .game-select-wrap
          button(@click.stop="openSearchModal('division')")
            p.select-text {{optionName('division')}}
            icon-under-arrow

          button.order-date(@click.stop="openSearchModal('date')")
            p.select-text {{displayDate}}
            icon-under-arrow
          button.submit(@click.stop="gameHistorySearch()") 조회
        .game-progress-table-wrap
          .table-title
            p 순번
            p 게임 일시
            p 실행 게임
            p 내기 종류
            p 내기 상세
            p 승리 테이블
            p 패배 테이블
          .table-body-wrap
            p.empty-data(v-if="resultData.totalContentCount === 0") 진행내역이 없습니다.
            .table-body-rows(v-for="(item, index) in resultData.gameRoomList" :key="getGameProgressKey(index)")
              p {{ item.no }}
              p {{ dateFormat(item.gameStartDateTime) }}
              p {{ item.gameName }}
              p {{ formatGameBetType(item.gameBetType) }}
              p {{ item.betDetail }}
              p {{ formatTable(item.victoryTableList) }}
              p {{ formatTable(item.defeatTableList) }}
        .wrap-pagination
          button.previous-button(v-if="pagination.firstPage > 1" v-on:click="selectPage({number: pagination.firstPage-1})") &lt;
          button.page-number(v-for="(page, index) in pagination.pages" :key="index" @click="selectPage(page)" :class="{paginationActive: page.current}") {{page.number}}
          button.next-button(v-if="pagination.lastPage != pagination.maxPage" v-on:click="selectPage({number: pagination.lastPage+1})") &gt;
      div(v-if="selectCategory === '게임상품 설정'")
        div 업데이트 예정입니다.
      div(v-if="selectCategory === '게임 설정'")
        .game-setting-sub-ctg-wrap
          .sub-category(
            :class="getActiveSubCtgStyle(subCtg)"
            v-for="(subCtg, index) in settingSubCategory"
            :key="getSubCategoryKey(index)"
            @click="getSelectSubCtg(subCtg)"
            ) {{ subCtg }}
        div(v-if="selectSetSubCtg === '게임 사용 여부'")
          div 업데이트 예정입니다.
        div(v-if="selectSetSubCtg === '퀵메세지 설정'")
          .quick-message-container
            .addition-wrap
              input.add-input(type="text" maxlength="10" placeholder="10자 이내로 입력해주세요" v-model="quickMsg")
              button.add-bt 추가
            .message-list-wrap
              .single-message(v-for="i in 20")
                div 안녕하세요안녕하세요
                icon-x-white-button
            .save-bt 저장
            icon-x-white-button
</template>

<script>
import { tableGame } from '@apis';

const { gameProgressHistory } = tableGame;

export default {
  data() {
    return {
      mainCategory : ['진행내역', '게임상품 설정', '게임 설정'],
      selectCategory: '진행내역',
      settingSubCategory : ['게임 사용 여부', '퀵메세지 설정'],
      selectSetSubCtg : '퀵메세지 설정',
      quickMsg: '',
      quickMsgList: [],
      resultData: {
        currentPage: 0,
        gameRoomList: [],
        maxPageNo: 0,
        pageSize: 0,
        totalContentCount: 0
      },
      currentSearchModal: null,
      picker: {
        today: null,
        context: null,
        number: null,
        selected: 'start',
      },
      searchOptions: {
        division: {
          name: '게임 구분',
          selected: null,
          list: {
            'ALL' : {
              name: '전체'
            },
            'CROCODILE_GAME' : {
              name: '악어룰렛'
            },
            'RSP_GAME' : {
              name: '가위바위보'
            },
            'ARCHERY_GAME': {
              name: '양궁'
            },
          },
        },
        datetime: {
          start: new Date(),
          end: new Date(),
        },
        table: {
          list: [],
        }
      },
      selectStartDate: undefined,
      selectEndDate: undefined,
    };
  },
  computed: {
    verticalModalVisible() {
      return this.currentSearchModal == 'division';
    },
    selectDate() {
      return this.selectStartDate && this.selectEndDate;
    },
    displayDate() {
      return this.selectDate ? `${this.selectStartDate.format('YYYY-MM-DD')} ~ ${this.selectEndDate.format('YYYY-MM-DD')}` : '날짜/시간별 조회';
    },
    selectDateModalVisible() {
      return this.currentSearchModal == 'date';
    },
    pagination() {
      const pageSize = 5;

      let currPage = this.resultData.currentPage;
      let maxPage = this.resultData.maxPageNo;

      let firstPage = currPage - pageSize;
      let lastPage = currPage + pageSize ;

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
      for (let i = firstPage; i <= lastPage; i++) {
        let current = false;
        if (i == currPage + 1) current = true;
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
  methods: {
    getMainCategoryKey(index) {
      return `game-main-category-index:${index}`;
    },
    getSelectMainCtg(item) {
      this.selectCategory = item;
    },
    getGameProgressKey(index) {
      return `game-progress-index:${index}`;
    },
    getSubCategoryKey(index) {
      return `game-setting-sub-ctg-index:${index}`;
    },
    getPaginationKey(index) {
      return `game-pagination-index:${index}`;
    },
    getSelectSubCtg(item) {
      this.selectSetSubCtg = item;
    },
    getActiveSubCtgStyle(item) {
      return {
        'sub-category' : true,
        'sub-active' : this.selectSetSubCtg === item,
      };
    },
    getActiveCtgStyle(item) {
      return {
        'main-category' : true,
        'active' : this.selectCategory === item,
      };
    },
    getActivePaginationStyle(page, index) {
      console.log(page, index);
      return {
        'pagination-num-bt' : true,
        'pagination-num-active' : page === index + 1,
      };
    },
    async reqGameProgressHistory(page) {
      try {
        const maskMoment = 'YYYY-MM-DD';
        const config = {
          params : {
            storeCode : this.$store.state.auth.store.store_code,
            from : this.$moment(this.searchOptions.datetime.start).format(maskMoment),
            to: this.$moment(this.searchOptions.datetime.end).format(maskMoment),
            game: this.searchOptions.division.selected,
            page: page,
            size: 30,
            sort: 'asc'
          }
        };
        const res = await gameProgressHistory(config);
        if (res?.data.resultCode === 200) {
          this.resultData = res.data.resultData;
        }

      } catch (error) {
        console.error(error);
      }
    },
    fillZero(number) {
      if (number < 10) {
        return `0${number}`;
      }
      return number;
    },
    dateFormat(date) {
      const dateParam = new Date(date);
      const formatDate = `
        ${dateParam.getFullYear()}.${this.fillZero(dateParam.getMonth() + 1)}.${this.fillZero(dateParam.getDate())}
        ${this.fillZero(dateParam.getHours())}:${this.fillZero(dateParam.getMinutes())}:${this.fillZero((dateParam.getSeconds()))}`;
      return formatDate;
    },
    formatGameBetType(gameBetType) {
      const format = gameBetType.replace('GOODS', '상품 내기').replace('CUSTOM', '자유 내기').replace('BILL', '계산 내기');
      return format;
    },
    formatTable(list) {
      const arr = list.join(', ');
      return arr;
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
    selectPage(page) {
      const number = page.number;
      this.reqGameProgressHistory(number - 1);
    },

    gameHistorySearch() {
      this.reqGameProgressHistory(0);
    },
  },
  mounted() {
    this.gameHistorySearch();
    this.pickerSelectToday();

    this.picker.today = this.$moment();
    this.picker.context = this.$moment();
  },
};
</script>

<style lang="scss">
.game-management-container {
  flex: 1;
  font-family: 'Spoqa Han Sans Neo', 'sans-serif';
  color:#fff;
  padding: 0.390625vw 0 0 !important;
  box-sizing: border-box;
  overflow: auto;


  .game-management-title {
    font-family: "notosans";
    font-weight: bold;
    font-size: 1.71875vw;
    padding: 1.5625vw 0 1.5625vw !important;
    color: #fff;
  }

    .main-categories {
    display: flex;
    align-items: center;
    gap: 0.78125vw;
    max-width: 84.53125vw;
    overflow: auto;

    .main-category {
      font-size: 1.5625vw;
      color: #ddd;
      letter-spacing: -0.0390625vw;
      background-color: #404144;
      padding: 1.328125vw 1.5625vw !important;
      box-sizing: border-box;
      border-top-left-radius: 1.015625vw;
      border-top-right-radius: 1.015625vw;
      white-space:nowrap;
      word-break: keep-all;
    }

    .active {
      color: #000;
      font-weight: bold;
      background-color: #fff;
    }
  }

  .background-white {
    background-color: #fff;
    height: calc(100% - 10.3125vw);
    padding: 1.5625vw !important;
    color:#000;
    box-sizing: border-box;

    .game-select-wrap {
      display: flex;
      justify-content: flex-start;
      gap: 0.7813vw;
      margin-bottom: 1.5625vw !important;

      > button {
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        font-size: 1.25vw;
        letter-spacing: -0.03125vw;
        height: 3.515625vw;
        padding: 0 1.171875vw ;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: none;
        border-radius: 0.390625vw;
      }

      .select-text {
        font-size: 1.25vw;
        margin-right: 0.7813vw !important;
      }

      .submit {
        color: #fff;
        justify-content: center;
        background-color: #fc0000;
      }
    }

    .game-progress-table-wrap {
      display: flex;
      flex-direction: column;

      .table-title {
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        font-size: 1.0938vw;
        display: grid;
        grid-template-columns: 0.5fr 1.5fr 1fr 1fr 1fr 1fr 1fr;
        align-items: center;
        border: solid 0.078125vw #ccc;
        border-left: none;
        border-right: none;
        padding: 1.5625vw !important;
        text-align: center;
        color:#666;
      }

      .table-body-wrap {
        height: 34.3750vw;
        margin-bottom: 0.7813vw !important;
        overflow: auto;

        .empty-data {
          font-size: 1.0938vw;
          text-align: center;
          margin-top: 2.3438vw !important;
        }

        .table-body-rows {
          display: grid;
          height: 4.3750vw;
          grid-template-columns: 0.5fr 1.5fr 1fr 1fr 1fr 1fr 1fr;
          font-size: 1.0938vw;
          align-items: center;
          padding: 1.5625vw !important;
          text-align: center;
          color:#666;
          box-sizing: border-box;
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

  .game-setting-sub-ctg-wrap {
    display: flex;

    .sub-category {
      width: 10.4688vw;
      height: 3.5156vw;
      padding: 0 1.1718vw;
      font-family: 'Spoqa Han Sans Neo', 'sans-serif';
      font-size: 1.25vw;
      letter-spacing: -0.03125vw;
      background-color: #efefef;
      border-radius: 0.3906vw;
      margin: 0 0.7813vw 2.3438vw 0 !important;
      text-align: center;
      line-height: 3.5156vw;
    }

    .sub-active {
      background-color: #000;
      color:#fff;
    }
  }

  .quick-message-container {

    .addition-wrap {
      display: flex;
      align-items: center;
      gap: 0.7813vw;

      .add-input {
        width: 12.8125vw;
        height: 1.0938vw;
        padding: 0.9375vw 1.5625vw !important;
        border-radius: 0.3906vw;
        border: 0.0781vw solid #d3dce6;
        font-size: 1.0938vw;
      }

      .add-bt {
        width: 4.6875vw;
        height: 3.125vw;
        background-color: #ef1515;
        color: #fff;
        border: none;
        border-radius: 0.3906vw;
        font-size: 1.25vw;
      }
    }

    .message-list-wrap {
      display: flex;
      margin: 1.5625vw 0 !important;
      flex-wrap: wrap;
      gap: 0.7813vw;
      border: 0.0781vw solid #d3dce6;
      border-radius: 0.7813vw;
      padding: 1.5625vw !important;
    }

    .single-message {
      font-family: 'Spoqa Han Sans Neo', 'sans-serif';
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5625vw !important;
      box-sizing: border-box;
      font-size: 1.0938vw;
      width: 14.8438vw;
      height: 3.125vw;
      border-radius: 1.1719vw;
      background-color: #000;
      color:#fff;
    }

    .save-bt {
      width: 7.8125vw;
      height: 3.125vw;
      background-color: #ef1515;
      color: #fff;
      border: none;
      border-radius: 0.3906vw;
      font-size: 1.25vw;
      text-align: center;
      line-height: 3.125vw;
    }

  }
}
</style>