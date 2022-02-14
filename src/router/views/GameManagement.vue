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
      .main-category(class="active" v-for="(item, index) in mainCategory" :key="getMainCategoryKey(index)") {{ item }}
    .background-white
      .game-select-wrap
        button(@click.stop="openSearchModal('division')")
          p.select-text {{optionName('division')}}
          icon-under-arrow

        button.order-date(@click.stop="openSearchModal('date')")
          p.select-text {{displayDate}}
          icon-under-arrow
        button.submit 조회
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
          .table-body-rows(v-for="(item, index) in progressData" :key="getGameProgressKey(index)")
            p {{ index + 1 }}
            p {{ dateFormat(item.gameStartDateTime) }}
            p {{ item.gameName }}
            p {{ formatGameBetType(item.gameBetType) }}
            p {{ item.betDetail }}
            p {{ formatTable(item.victoryTableList) }}
            p {{ formatTable(item.defeatTableList) }}
      .wrap-pagination
        button.previous-button( v-on:click="selectPage({number: pagination.firstPage-1})") &lt;
        button.page-number(v-for="(page, index) in pagination.pages" :key="index" @click="selectPage(page)" :class="{paginationActive: page.current}") {{page.number}}
        button.next-button( v-on:click="selectPage({number: pagination.lastPage+1})") &gt;

</template>

<script>
import { tableGame } from '@apis';

const { gameProgressHistory } = tableGame;

export default {
  data() {
    return {
      // mainCategory : ['진행내역', '게임상품 설정', '게임 설정']
      mainCategory : ['진행내역'],
      progressData: [],
      currentSearchModal: null,
      picker: {
        today: null,
        context: null,
        number: null,
        numberRefeshTemp: null,
        selected: 'start',
      },
      searchOptions: {
        division: {
          name: '게임 구분',
          selected: null,
          list: {
            'roulette' : {
              name: '악어룰렛'
            },
            'RPS' : {
              name: '가위바위보'
            },
          },
        },
        lookUp: {
          name: '조회기간',
          selected: null,
          list: {
            //
          }
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
      return this.currentSearchModal == 'division' || this.currentSearchModal == 'lookUp';
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
  },
  methods: {
    getMainCategoryKey(index) {
      return `game-main-category-index:${index}`;
    },
    getGameProgressKey(index) {
      return `game-progress-index:${index}`;
    },
    async reqGameProgressHistory() {
      try {
        const res = await gameProgressHistory();
        this.progressData = res.data.resultData.gameRoomList;
        // console.log(this.progressData, '진행내역');
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
    // selectPage(page) {
    //   const number = page.number;
    //   this.updatePaymentList(number);
    // },
  },
  mounted() {
    this.reqGameProgressHistory();
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
}
</style>