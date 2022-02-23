<template lang="pug">
  .wrap-notice-page
    .orders-container
      p.store-name {{storeName}}{{version}}
      .header-orders-status-list
        .orders-status(@click="setViewMode('ALL')" :class="{activeButton: viewMode === 'ALL'}")
          p 전체
        .orders-status(@click="setViewMode('NOTICE')" :class="{activeButton: viewMode === 'NOTICE'}")
          p 공지사항
        .orders-status(@click="setViewMode('UPDATE')" :class="{activeButton: viewMode === 'UPDATE'}")
          p 업데이트
        .orders-status(@click="setViewMode('EVENT')" :class="{activeButton: viewMode === 'EVENT'}")
          p 이벤트
      .wrap-order-list(v-if="!isDetailInfo")
        .wrap_search_notice
          .search_notice
            select.search_notice_select(v-model="searchType")
              option(value="TITLE") 제목
              option(value="DESC") 내용
            input.search_notice_input(type="text" v-model="searchText")
            button.search_notice_submit(@click="searchNoticeList") 검색
        .wrap-search_notice_list
          .wrap-notice-list-title
            p.notice-list-title 번호
            p.notice-list-title 구분
            p.notice-list-title.title 제목
            p.notice-list-title 작성자
            p.notice-list-title 작성일
          .notice-list
            div(
              :class="getNoticeStyle(notice)"
              v-for="(notice, index) in noticeList"
              :key="`notice-list-key-${index}`"
              @click="goDetailNotice(notice)"
            )
              p.notice-no {{getNoticeNumber(notice)}}
              p.notice-type {{getNoticeType(notice)}}
              .wrap-notice-title
                p.notice-title {{getNoticeTitle(notice)}}
                paper-clip(v-if="isNoticeFile(notice)")
                p.notice-new(v-if="isNoticeNew(notice)") N
              p.notice-writer {{getNoticeAuthor(notice)}}
              p.notice-write-date {{getNoticeDate(notice)}}
        .wrap-pagination
          button.previous-button(@click="getNoticePreviousPageData") &lt;
          button(
            v-for="(page, index) in getNoticePageList"
            :key="index"
            :class="getPageStyle(page)"
            @click="getNoticeSelectPageData(page)"
          ) {{page}}
          button.next-button(@click="getNoticeNextPageData") &gt;
      notice-detail(
        v-else
        :isMainNotice="isDetailMainNotice"
        :noticeType="getDetailNoticeType"
        :noticeTitle="getDetailNoticeTitle"
        :isNoticeNew="isDetailNoticeNew"
        :noticeAuthor="getDetailNoticeAuth"
        :noticeWriteDate="getDetailNoticeDate"
        :noticeContents="getDetailNoticeContents"
        :noticeFileList="getDetailNoticeFileList"
        :goNoticeList="goNoticeList"
      )
</template>

<script>
import {
  PaperClip
} from '@svg';
import { version } from '@utils/constants';
import paths from '@router/paths';
import NoticeDetail from '@components/NoticeDetail.vue';
import {
  notice
} from '@apis';

const {
  getNoticeInfo,
  getDetailNoticeInfo
} = notice;


export default {
  components: {
    NoticeDetail,
    PaperClip,
  },
  data () {
    return {
      viewMode: 'ALL',
      isLoading: false,
      chooseOrder: {},
      version,
      paths,
      searchType: 'TITLE',
      searchText: '',
      noticeData: {
        totalContentCount: 10,
        pageSize: 10,
        currentPage: 0,
        maxPageNo: 1,
        noticeMasterList: [],
        newStatus: 0,
        noticeNewCount: 0,
      },
      noticeDetailData: {
        noticeTitle: '',
        noticeCategory: '',
        noticeDesc: '',
        author: '',
        createDate: '',
        topFix: 0,
        noticeFileList: [],
        newStatus: 0,
      }
    };
  },
  computed: {
    storeName() {
      const { auth } = this;
      return auth && auth.store && auth.store.store_name;
    },
    isDetailInfo() {
      return this.$route.query?.noticeId;
    },
    noticeList() {
      return this.noticeData.noticeMasterList;
    },
    getCurrentPage() {
      return this.noticeData.currentPage + 1 || 1;
    },
    getNoticePageList() {
      const maxPage = this.noticeData.maxPageNo;

      if (maxPage <= 10) {
        return maxPage;
      }

      const currentPage = this.getCurrentPage;
      const startPage = currentPage - (currentPage % 10) + 1;
      const endPage = startPage + 9 < maxPage ? startPage + 9 : maxPage;

      const answer = [];
      for (let i = startPage; i <= endPage; i += 1) {
        answer.push(i);
      }

      return answer;
    },
    isNotLastPage() {
      const page = this.getCurrentPage;
      const maxPage = this.noticeData.maxPageNo;

      return page < maxPage;
    },
    isNotFirstPage() {
      const page = this.getCurrentPage;

      return page > 1;
    },
    isDetailMainNotice() {
      return this.noticeDetailData.topFix === 1;
    },
    getDetailNoticeType() {
      const type = this.noticeDetailData.noticeCategory;

      if (type === 'UPDATE') {
        return '업데이트';
      }

      if (type === 'EVENT') {
        return '이벤트';
      }

      if (type === 'ALL') {
        return '전체';
      }

      if (type === 'NOTICE') {
        return '공지사항';
      }

      return '';
    },
    getDetailNoticeTitle() {
      return this.noticeDetailData.noticeTitle;
    },
    isDetailNoticeNew() {
      return this.noticeDetailData.newStatus;
    },
    getDetailNoticeAuth() {
      return this.noticeDetailData.author;
    },
    getDetailNoticeDate() {
      return this.noticeDetailData.createDate;
    },
    getDetailNoticeContents() {
      return this.noticeDetailData.noticeDesc;
    },
    getDetailNoticeFileList() {
      return this.noticeDetailData.noticeFileList;
    },
  },
  methods: {
    async setViewMode(value) {
      document.querySelector(".header-orders-status-list").scrollTop = 0;
      await this.getNoticeSelectCategory(value);
      this.viewMode = value;
      this.noticeDetailData = {
        "noticeTitle": "",
        "noticeCategory": "",
        "noticeDesc": "",
        "author": "",
        "createDate": "",
        "topFix": 0,
        "noticeFileList": [],
        "newStatus": 0,
      };

      if (this.isDetailInfo) {
        this.$router.push({
          name: 'notice'
        });
      }
    },
    getNoticeNumber(data) {
      if (data?.topFix === 1) {
        return '공지';
      }

      return data?.noticeId;
    },
    getNoticeStyle(data) {
      return {
        'notice-info': true,
        'main-notice': data?.topFix === 1,
      };
    },
    getNoticeType(data) {
      const type = data?.noticeCategory;

      if (type === 'UPDATE') {
        return '업데이트';
      }

      if (type === 'EVENT') {
        return '이벤트';
      }

      return '공지사항';
    },
    getNoticeTitle(data) {
      return data?.noticeTitle;
    },
    getNoticeAuthor(data) {
      return data?.author;
    },
    getNoticeDate(data) {
      return data?.createDate;
    },
    getPageStyle(page) {
      return {
        'page-number': true,
        'paginationActive': page === this.getCurrentPage,
      };
    },
    isNoticeNew(data) {
      return data.newStatus === 1;
    },
    isNoticeFile(data) {
      return data.noticeFileStatus === 1;
    },
    async getDefaultNoticeData() {
      try {
        const res = await getNoticeInfo('page=0&size=10&noticeCategory=ALL&noticeStatus=1&noticeSearchQuery=&noticeCaller=MASTER');

        this.noticeData = res.data;
      } catch {
        console.log('에러');
      }
    },
    async getNoticeSelectPageData(page) {
      const type = this.searchType;
      const contents = this.searchText;
      const viewMode = this.viewMode;
      if (page !== this.getCurrentPage || this.noticeList.length === 0) {
        try {
          const res = await getNoticeInfo(`page=${page - 1}&size=10&noticeCategory=${viewMode}&noticeStatus=1&noticeSearchType=${type}&noticeSearchQuery=${contents}&noticeCaller=MASTER`);

          this.noticeData = res.data;
        } catch {
          console.log('에러');
        }
      }
    },
    async getNoticeNextPageData() {
      const page = this.getCurrentPage;
      const type = this.searchType;
      const contents = this.searchText;
      const viewMode = this.viewMode;

      if (this.isNotLastPage) {
        try {
          const res = await getNoticeInfo(`page=${page}&size=10&noticeCategory=${viewMode}&noticeStatus=1&noticeSearchType=${type}&noticeSearchQuery=${contents}&noticeCaller=MASTER`);

          this.noticeData = res.data;
        } catch {
          console.log('에러');
        }
      }
    },
    async getNoticePreviousPageData() {
      const page = this.getCurrentPage;
      const type = this.searchType;
      const contents = this.searchText;
      const viewMode = this.viewMode;

      if (this.isNotFirstPage) {
        try {
          const res = await getNoticeInfo(`page=${page - 2}&size=10&noticeCategory=${viewMode}&noticeStatus=1&noticeSearchType=${type}&noticeSearchQuery=${contents}&noticeCaller=MASTER`);

          this.noticeData = res.data;
        } catch {
          console.log('에러');
        }
      }
    },
    async getNoticeSelectCategory(category) {
      if (this.viewMode !== category) {
        try {
          const res = await getNoticeInfo(`page=$0&size=10&noticeCategory=${category}&noticeStatus=1&noticeSearchQuery=&noticeCaller=MASTER`);

          this.noticeData = res.data;
        } catch {
          console.log('에러');
        }
      }
    },
    async searchNoticeList() {
      const type = this.searchType;
      const contents = this.searchText;
      const viewMode = this.viewMode;

      if (contents !== '') {
        try {
          const res = await getNoticeInfo(`page=$0&size=10&noticeCategory=${viewMode}&noticeStatus=1&noticeSearchType=${type}&noticeSearchQuery=${contents}&noticeCaller=MASTER`);

          this.noticeData = res.data;
        } catch {
          console.log('에러');
        }
      }
    },
    async getNoticeDetailInfo(data) {
      const query = `${data.noticeId}`;

      try {
        const res = await getDetailNoticeInfo(query);

        this.noticeDetailData = res.data.noticeMasterDetailVo;
        console.log(this.noticeDetailData);
      } catch(error) {
        console.log('에러' ,error);
      }
    },
    async goNoticeList() {
      const page = this.getCurrentPage;

      await this.getNoticeSelectPageData(page);
      this.$router.push({
        name: 'notice',
      });
    },
    goDetailNotice(data) {
      this.getNoticeDetailInfo(data);

      this.$router.push({
        name: 'notice',
        query: {
          noticeId: data.noticeId,
        },
      });
    },
  },
  created() {
    console.log('테스트');
    if (this.isDetailInfo) {
      this.getNoticeDetailInfo(this.$route.query);
    }

    this.getDefaultNoticeData();
  },
  mounted() {
    console.log('테스트');
  }
};
</script>
<style lang="scss" scoped>
input::placeholder {
  font-family: Spoqa Han Sans Neo, sans-serif;
  font-size: 13px;
  color: #ccc;
  letter-spacing: -0.65px;
}

input:focus {
  outline: solid 1px #6876f2;
  box-shadow: 3px 3px 6px 0 rgba(104, 118, 242, 0.2), inset 2px 2px 2px 0 rgba(0, 0, 0, 0.05);
}

select:focus {
  outline: solid 1px #6876f2;
  box-shadow: 3px 3px 6px 0 rgba(104, 118, 242, 0.2), inset 2px 2px 2px 0 rgba(0, 0, 0, 0.05);
}

select {
  option {
    font-family: Spoqa Han Sans Neo, sans-serif;
    font-size: 13px;
    color: #000;
    letter-spacing: -0.65px;
  }
}

option:hover {
  background-color: #eeefff;
}

input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

button,
select,
input {
  font-family: Spoqa Han Sans Neo, sans-serif;
}

.orders-container {
  font-family: 'Spoqa Han Sans Neo', 'sans-serif';
  display: flex;
  flex-direction: column;
  height: 100vh;

  .store-name {
    width: 83.59375vw;
    height: 3.125vw;
    display: flex;
    font-size: 0.9375vw;
    color: #fff;
    justify-content: flex-end;
    align-items: center;
  }

  .header-orders-status-list {
    width: 83.59375vw;
    display: flex;
    align-items: center;
    gap: 0.78125vw;
    font-size: 1.5625vw;
    font-weight: bold;
    color: #ddd;

    .orders-status {
      flex: 1;
      min-height: 4.6875vw;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1.5625vw;
      background-color: #404144;
      border-top-left-radius: 0.78125vw;
      border-top-right-radius: 0.78125vw;
      letter-spacing: -0.0390625vw;

      span {
        font-size: 3.125vw;
        letter-spacing: -0.078125vw;
        color: #fff;
      }
    }

    .activeButton {
      background-color: #fff !important;
      color: #000;

      span {
        color: #000;
      }
    }
  }

  .wrap-order-list {
    flex:1;
    width: 84.53125vw;
    background-color: #fff;
    padding: 0 1.5625vw !important;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow-y: auto;

    .wrap_search_notice {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 1.25vw 0 0.78125vw !important;

      .search_notice {
        display: flex;
        align-items: center;
        gap: 0.625vw;

        .search_notice_select {
          box-sizing: border-box;
          width: 6.25vw;
          height: 2.578125vw;
          padding: 0 0.9375vw;
          font-size: 1.015625vw;
          color: #aaa;
          letter-spacing: -0.05078125vw;
          background-color: #fcfcfc;
          border: solid 0.078125vw #e9e8eb;
          border-radius: 0.234375vw;
          box-shadow: inset 0.15625vw 0.15625vw 0.15625vw 0 rgba(0, 0, 0, 0.05);
        }

        .search_notice_input {
          box-sizing: border-box;
          width: 17.1875vw;
          height: 2.578125vw;
          padding: 0 0.9375vw;
          background-color: #fcfcfc;
          border: solid 0.078125vw #e9e8eb;
          border-radius: 0.234375vw;
          box-shadow: inset 0.15625vw 0.15625vw 0.15625vw 0 rgba(0, 0, 0, 0.05);
        }

        .search_notice_submit {
          width: 4.6875vw;
          height: 2.578125vw;
          font-size: 1.09375vw;
          font-weight: bold;
          color: #fff;
          letter-spacing: -0.0546875vw;
          cursor: pointer;
          background-color: #2f2f39;
          border: none;
          border-radius: 0.390625vw;
        }
      }

    }

    .wrap-search_notice_list {
      flex: 1;
      .wrap-notice-list-title {
        display: grid;
        align-items: center;
        grid-template-columns: 1fr 2fr 10fr 2fr 2fr;
        gap: 2.34375vw;
        padding: 0.78125vw !important;
        border-bottom: solid 0.078125vw #333333;
        box-sizing: border-box;

        .notice-list-title {
          text-align: center;
          font-size: 1.25vw;
          color: #000;
          text-align: center;
        }
      }

      .notice-list {
        height: 40vw;
        .notice-info {
          display: grid;
          align-items: center;
          grid-template-columns: 1fr 2fr 10fr 2fr 2fr;
          gap: 2.34375vw;
          padding: 1.09375vw 0.78125vw !important;
          box-sizing: border-box;
          border-bottom: solid 0.078125vw #ccc;

          > p {
            text-align: center;
            font-size: 1.09375vw;
            color: #666;
          }

          .wrap-notice-title {
            display: flex;
            align-items: center;
            gap: 0.390625vw;
            height: 1.875vw;

            .notice-title {
              text-align: left;
              font-size: 1.09375vw;
              color: #666;
            }

            .notice-new {
              background-color: #666;
              color: #fff;
              font-size: 0.9375vw;
              padding: 0.234375vw 0.625vw !important;
              box-sizing: border-box;
              border-radius: 0.390625vw;
            }
          }
        }

        .main-notice {
          font-weight: bold;
          background-color: #555;

          > p {
            font-weight: bold;
            color: #fff;
          }

          .wrap-notice-title {
            .notice-title {
              font-weight: bold;
              color: #fff;
            }

            .notice-new {
              background-color: #666;
              color: #fff;
              font-size: 0.9375vw;
              padding: 0.234375vw 0.625vw !important;
              box-sizing: border-box;
              border-radius: 0.390625vw;
            }
          }

          .notice-no {
            background-color: #fc0000;
            border-radius: 0.234375vw;
          }
        }
      }
    }

    .wrap-pagination {
      padding: 1.25vw 0;
      min-height: 5vw;
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
}

</style>