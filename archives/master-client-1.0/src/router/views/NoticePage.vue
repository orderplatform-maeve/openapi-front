<template lang="pug">
.wrap-notice-page
  notice-search-type-modal(
    v-if="isNoticeTypeModalVisible"
    :data="noticeTypeList"
    :currentType="getSearchType"
    :selectType="selectNoticeType"
    :closeSearchModal="closeNoticeTypeModal"
  )
  send-file-modal(
    v-if="sendFileModalVisible"
    :fileList="sendFileList"
    :phoneNumber="phoneNumber"
    :updatePhoneNumber="updatePhoneNumber"
    :cancelSendFile="cancelSendFile"
    :openSendFileCheckModal="openSendFileCheckModal"
  )
  send-file-result-modal(
    v-if="fileResultModalVisible"
    :fileResultModalCount="fileResultModalCount"
    :fileResultModalCountClose="fileResultModalCountClose"
    :phoneNumber="phoneNumber"
    :startSendFileResultInterval="startSendFileResultInterval"
  )
  send-file-check-modal(
    v-if="sendFileCheckModalVisible"
    :fileList="sendFileList"
    :phoneNumber="phoneNumber"
    :cancelSendFile="closeSendFileCheckModal"
    :sendFile="sendFile"
  )
  .orders-container
    p.store-name {{storeName}}{{version}}
    .header-orders-status-list
      div(
        :class="getOrderStatusAllStyle"
        @click="setViewMode('EVENT, UPDATE, NOTICE, NEWS')"
      )
        p 전체
      div(
        :class="getOrderStatusNoticeStyle"
        @click="setViewMode('NOTICE')"
      )
        p 공지사항
      div(
        :class="getOrderStatusUpdateStyle"
        @click="setViewMode('UPDATE')"
      )
        p 업데이트
      div(
        :class="getOrderStatusEventStyle"
        @click="setViewMode('EVENT')"
      )
        p 이벤트
      div(
        :class="getOrderStatusNewsStyle"
        @click="setViewMode('NEWS')"
      )
        p 뉴스
    .wrap-order-list(v-if="!isDetailInfo")
      .wrap-search-notice
        .search-notice
          button.search-notice-select(@click="openNoticeTypeModal")
            p.select-button {{getSearchType}}
            icon-under-arrow
          input.search-notice-input(
            type="text"
            v-model="searchText"
          )
          button.search-notice-submit(@click="searchNoticeList") 검색
      .wrap-search-notice-list
        .wrap-notice-list-title
          p.notice-list-title No
          p.notice-list-title 구분
          p.notice-list-title 제목
          p.notice-list-title 작성자
          p.notice-list-title 작성일
        .notice-list
          div(
            :class="getNoticeStyle(notice)"
            v-for="(notice, index) in noticeList"
            :key="`notice-list-key-${index}`"
            @click="goDetailNotice(notice)"
          )
            .wrap-notice-no
              p.notice-no {{getNoticeNumber(notice)}}
            p(:class="getNoticeTypeStyle(notice)") {{getNoticeType(notice)}}
            .wrap-notice-title
              p.notice-title {{getNoticeTitle(notice)}}
              paper-clip(
                v-if="isNoticeFile(notice)"
                :width="'1.103515625vw'"
                :height="'1.154921875vw'"
              )
              new-icon(v-if="isNoticeNew(notice)")
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
      :fileCheckboxList="fileCheckboxList"
      :updateFileCheckbox="updateFileCheckbox"
      :realSendFilePart="realSendFilePart"
      :sendAllFileModal="sendAllFileModal"
    )
</template>

<script>
import {
  PaperClip,
  NewIcon,
} from '@svg';
import { version } from '@utils/constants';
import paths from '@router/paths';
import {
  NoticeDetail,
  NoticeSearchTypeModal,
  SendFileModal,
  SendFileResultModal,
  SendFileCheckModal,
} from '@components';

import {
  notice
} from '@apis';

const {
  getNoticeInfo,
  getDetailNoticeInfo,
  postNoticeMessage
} = notice;


export default {
  components: {
    NoticeDetail,
    PaperClip,
    NoticeSearchTypeModal,
    NewIcon,
    SendFileModal,
    SendFileResultModal,
    SendFileCheckModal,
  },
  data () {
    return {
      viewMode: 'EVENT, UPDATE, NOTICE, NEWS',
      isLoading: false,
      chooseOrder: {},
      version,
      paths,
      searchType: 'TITLE',
      searchText: '',
      noticeData: {
        totalContentCount: 10,
        pageSize: 8,
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
      },
      sendFileModalVisible: false,
      fileCheckboxList: [],
      sendFileList: [],
      phoneNumber: '010-',
      noticeTypeList: [
        '제목',
        '내용',
      ],
      isNoticeTypeModalVisible: false,
      fileResultModalVisible: false,
      fileResultModalCount: 5,
      fileResultModalInterval: -1,
      sendFileCheckModalVisible: false,
    };
  },
  computed: {
    storeName() {
      const { auth } = this;
      return auth && auth.store && auth.store.store_name;
    },
    getStoreCode() {
      return this.$store.state.auth.store.store_code;
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

      const currentPage = this.getCurrentPage - 1;
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

      if (type === 'NEWS') {
        return '뉴스';
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
    getSearchType() {
      const data = this.searchType;
      if (data === 'TITLE') {
        return '제목';
      }

      if (data === 'DESC') {
        return '내용';
      }

      return data;
    },
    getOrderStatusAllStyle() {
      const isViewModeAll = this.viewMode === 'EVENT, UPDATE, NOTICE, NEWS';
      const orderStatusAllStyle = {
        'orders-status': true,
        'active-button': isViewModeAll,
      };

      return orderStatusAllStyle;
    },
    getOrderStatusNoticeStyle() {
      const isViewModeNotice = this.viewMode === 'NOTICE';
      const orderStatusNoticeStyle = {
        'orders-status': true,
        'active-button': isViewModeNotice,
      };

      return orderStatusNoticeStyle;
    },
    getOrderStatusUpdateStyle() {
      const isViewModeUpdate = this.viewMode === 'UPDATE';
      const orderStatusUpdateStyle = {
        'orders-status': true,
        'active-button': isViewModeUpdate,
      };

      return orderStatusUpdateStyle;
    },
    getOrderStatusEventStyle() {
      const isViewModeEvent = this.viewMode === 'EVENT';
      const orderStatusEventStyle = {
        'orders-status': true,
        'active-button': isViewModeEvent,
      };

      return orderStatusEventStyle;
    },
    getOrderStatusNewsStyle() {
      const isViewModeEvent = this.viewMode === 'NEWS';
      const orderStatusEventStyle = {
        'orders-status': true,
        'active-button': isViewModeEvent,
      };

      return orderStatusEventStyle;
    }
  },
  methods: {
    async setViewMode(value) {
      document.querySelector(".header-orders-status-list").scrollTop = 0;
      let data = '';

      if (value === 'ALL') {
        data = 'UPDATE, EVENT, NOTICE, NEWS';
      } else {
        data = value;
      }
      await this.getNoticeSelectCategory(data);
      this.viewMode = value;
      this.noticeDetailData = {
        noticeTitle: '',
        noticeCategory: '',
        noticeDesc: '',
        author: '',
        createDate: '',
        topFix: 0,
        noticeFileList: [],
        newStatus: 0,
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
        'read-notice': data?.noticeCheckStatus === 0,
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

      if (type === 'NEWS') {
        return '뉴스';
      }

      return '공지사항';
    },
    getNoticeTypeStyle(data) {
      const type = data?.noticeCategory;
      const isUpdateType = type === 'UPDATE';
      const isEventType = type === 'EVENT';

      const noticeTypeStyle = {
        'type-notice': true,
        'type-update': isUpdateType,
        'type-event': isEventType,
      };

      return noticeTypeStyle;
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
        const res = await getNoticeInfo(`page=0&size=8&noticeCategoryList=EVENT,UPDATE,NOTICE,NEWS&noticeStatusList=1&noticeSearchQuery=&noticeCaller=MASTER&storeCode=${this.getStoreCode}`);
        console.log(res.data);

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
          const res = await getNoticeInfo(`page=${page - 1}&size=8&noticeCategoryList=${viewMode}&noticeStatusList=1&noticeSearchType=${type}&noticeSearchQuery=${contents}&noticeCaller=MASTER&storeCode=${this.getStoreCode}`);

          this.noticeData = res.data;
        } catch {
          console.log('에러');
        }
      }
    },
    async getNoticeSelectDetailPageData(page) {
      const type = this.searchType;
      const contents = this.searchText;
      const viewMode = this.viewMode;
      try {
        const res = await getNoticeInfo(`page=${page - 1}&size=8&noticeCategoryList=${viewMode}&noticeStatusList=1&noticeSearchType=${type}&noticeSearchQuery=${contents}&noticeCaller=MASTER&storeCode=${this.getStoreCode}`);

        this.noticeData = res.data;
      } catch {
        console.log('에러');
      }
    },
    async getNoticeNextPageData() {
      const page = this.getCurrentPage;
      const type = this.searchType;
      const contents = this.searchText;
      const viewMode = this.viewMode;

      if (this.isNotLastPage) {
        try {
          const res = await getNoticeInfo(`page=${page}&size=8&noticeCategoryList=${viewMode}&noticeStatusList=1&noticeSearchType=${type}&noticeSearchQuery=${contents}&noticeCaller=MASTER&storeCode=${this.getStoreCode}`);

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
          const res = await getNoticeInfo(`page=${page - 2}&size=8&noticeCategoryList=${viewMode}&noticeStatusList=1&noticeSearchType=${type}&noticeSearchQuery=${contents}&noticeCaller=MASTER&storeCode=${this.getStoreCode}`);

          this.noticeData = res.data;
        } catch {
          console.log('에러');
        }
      }
    },
    async getNoticeSelectCategory(category) {
      if (this.viewMode !== category) {
        try {
          const res = await getNoticeInfo(`page=$0&size=8&noticeCategoryList=${category}&noticeStatusList=1&noticeSearchQuery=&noticeCaller=MASTER&storeCode=${this.getStoreCode}`);

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
          const res = await getNoticeInfo(`page=$0&size=8&noticeCategoryList=${viewMode}&noticeStatusList=1&noticeSearchType=${type}&noticeSearchQuery=${contents}&noticeCaller=MASTER&storeCode=${this.getStoreCode}`);

          this.noticeData = res.data;
        } catch {
          console.log('에러');
        }
      }
    },
    async getNoticeDetailInfo(data) {
      const query = `${data.noticeId}?noticeCaller=MASTER&storeCode=${this.getStoreCode}`;

      try {
        const res = await getDetailNoticeInfo(query);
        this.noticeDetailData = res.data.noticeMasterDetailVo;

        return res;
      } catch(error) {
        console.log('에러' ,error);
        return false;
      }
    },
    async goNoticeList() {
      const page = this.getCurrentPage;

      await this.getNoticeSelectDetailPageData(page);
      this.$router.push({
        name: 'notice',
      });
    },
    async goDetailNotice(data) {
      const res = await this.getNoticeDetailInfo(data);
      if (res?.status === 200) {
        this.$store.commit('noticePopup/updateNoticeQuantity', res.data?.noticeMasterDetailVo?.noticeNewCount);
        this.$router.push({
          name: 'notice',
          query: {
            noticeId: data.noticeId,
          },
        });
      }
    },
    updateFileCheckbox(data) {
      this.fileCheckboxList = data;
    },
    realSendFilePart() {
      if (this.fileCheckboxList.length > 0) {
        this.sendFileList = this.fileCheckboxList.map((index) => this.noticeDetailData.noticeFileList[index]);
        this.sendFileModalVisible = true;
      } else {
        this.$store.commit('pushFlashMessage', '선택한 파일이 없습니다.');
      }
    },
    sendAllFileModal() {
      this.sendFileList = this.noticeDetailData.noticeFileList.slice();
      this.sendFileModalVisible = true;
    },
    autoHypenPhone(str){
      str = str?.replace(/[^0-9]/g, '');
      var tmp = '';

      if( str.length < 4){
        return str;
      } else if(str.length < 8){
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3);
        return tmp;
      } else{
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3, 4);
        tmp += '-';
        tmp += str.substr(7);
        return tmp;
      }
    },
    updatePhoneNumber(key) {
      if (/^\d+$/g.test(key)) {
        //this.phoneNumber += String(key.code);

        if (this.phoneNumber.length < 13) {
          this.phoneNumber = this.autoHypenPhone(this.phoneNumber + String(key));
        }
      } else if(key=='d') {
        this.phoneNumber = this.autoHypenPhone(this.phoneNumber.slice(0,-1));
        //this.phoneNumber = this.phoneNumber.slice(0,-1);
      } else if(key=='r') {
        this.phoneNumber = '010-';
      }
    },
    async sendFile(fileList, phoneNumber) {
      const data = {
        noticeId: Number(this.isDetailInfo),
        noticeFiles: fileList.map((file) => file.filePath),
        phoneNumber: phoneNumber?.replace(/-/gi, ''),
      };

      try {
        const res = await postNoticeMessage(data);
        if (res.status === 200) {
          this.cancelSendFile();
          this.closeSendFileCheckModal();
          this.openSendFileResultModal();
        }
      } catch(error) {
        console.log(error);
      }
    },
    cancelSendFile() {
      this.sendFileModalVisible = false;
    },
    openSendFileCheckModal() {
      this.cancelSendFile();
      this.sendFileCheckModalVisible = true;
    },
    closeSendFileCheckModal() {
      this.cancelSendFile();
      this.sendFileCheckModalVisible = false;
    },
    openNoticeTypeModal() {
      this.isNoticeTypeModalVisible = true;
    },
    closeNoticeTypeModal() {
      this.isNoticeTypeModalVisible = false;
    },
    selectNoticeType(data) {
      this.closeNoticeTypeModal();
      if (data === '제목') {
        this.searchType = 'TITLE';
        return;
      }
      if (data === '내용') {
        this.searchType = 'DESC';
        return;
      }

      this.searchType = data;
    },
    fileResultModalCountClose() {
      this.fileResultModalVisible = false;
      this.closeSendFileResultInterval();
      this.phoneNumber = '010-';
      this.fileResultModalCount = 5;
    },
    openSendFileResultModal() {
      this.fileResultModalVisible = true;
    },
    startSendFileResultInterval() {
      this.fileResultModalInterval = setInterval(() => {
        if (this.fileResultModalCount > 1) {
          this.fileResultModalCount -= 1;
        } else {
          this.fileResultModalCountClose();
        }
      }, 1000);
    },
    closeSendFileResultInterval() {
      clearInterval(this.fileResultModalInterval);
    }
  },
  created() {
    if (this.isDetailInfo) {
      this.getNoticeDetailInfo(this.$route.query);
    }

    this.getDefaultNoticeData();
  },
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

    .active-button {
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

    .wrap-search-notice {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 1.171875vw 0 0.7421875vw !important;

      .search-notice {
        display: flex;
        align-items: center;
        gap: 0.625vw;

        .search-notice-select {
          font-family: 'Spoqa Han Sans Neo', 'sans-serif';
          box-sizing: border-box;
          width: 7.8125vw;
          height: 3.125vw;
          padding: 0.7421875vw 1.171875vw !important;
          font-size: 1.25vw;
          letter-spacing: -0.03125vw;
          background-color: #fcfcfc;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 0.390625vw;
          border: solid 1px #000;
        }

        .search-notice-input {
          font-family: 'Spoqa Han Sans Neo', 'sans-serif';
          box-sizing: border-box;
          width: 15.625vw;
          height: 3.125vw;
          padding: 0.7421875vw 1.171875vw !important;
          border: solid 1px #000;
          border-radius: 0.390625vw;
          font-size: 1.25vw;
          letter-spacing: -0.03125vw;
        }

        .search-notice-submit {
          font-family: 'Spoqa Han Sans Neo', 'sans-serif';
          width: 6.25vw;
          height: 3.125vw;
          cursor: pointer;
          background-color: #12151d;
          font-size: 1.40625vw;
          font-weight: bold;
          letter-spacing: -0.03515625vw;
          color: #fff;
          border: none;
          border-radius: 0.390625vw;
        }
      }

    }

    .wrap-search-notice-list {
      .wrap-notice-list-title {
        display: grid;
        align-items: center;
        grid-template-columns: 7.677543186fr 11.516314779fr 55.854126679fr 12.476007678fr 12.476007678fr;
        padding: 1.2109375vw 0vw !important;
        border-bottom: solid 0.078125vw #ccc;
        border-top: solid 0.078125vw #ccc;
        box-sizing: border-box;;
        height: 3.90625vw;

        .notice-list-title {
          text-align: center;
          font-size: 1.25vw;
          color: #000;
          font-family: 'Spoqa Han Sans Neo', 'sans-serif';
          font-size: 1.09375vw;
          color: #666
        }
      }

      .notice-list {
        height: 39.53125vw;
        overflow-y: auto;
        .notice-info:nth-child(2n - 1) {
          background-color: #f5f5f5;
        }
        .notice-info {
          display: grid;
          align-items: center;
          grid-template-columns: 7.677543186fr 11.516314779fr 55.854126679fr 12.476007678fr 12.476007678fr;
          padding: 1.125vw 0vw !important;
          box-sizing: border-box;

          > p {
            font-family: 'Spoqa Han Sans Neo', 'sans-serif';
            text-align: center;
            font-size: 1.5625vw;
            color: #999;
          }

          .wrap-notice-title {
            position: relative;
            display: flex;
            align-items: center;
            gap: 0.78125vw;

            .notice-title {
              max-width: 45.46875vw;
              text-align: left;
              font-size: 2.1875vw;
              font-family: 'Spoqa Han Sans Neo', 'sans-serif';
              color: #999;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }

          .wrap-notice-no {
            display: flex;
            justify-content: center;
            align-items: center;
            .notice-no {
              font-family: 'Spoqa Han Sans Neo', 'sans-serif';
              font-size: 2.1875vw;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #999;
            }
          }
        }

        .main-notice {
          font-weight: bold;

          > p {
            font-weight: bold;
            color: #000;
          }

          .wrap-notice-title {
            .notice-title {
              font-weight: bold;
              color: #000;
            }
          }

          .wrap-notice-no {
            display: flex;
            justify-content: center;
            align-items: center;
            .notice-no {
              width: 4.6875vw;
              height: 2.34375vw;
              font-family: 'Spoqa Han Sans Neo', 'sans-serif';
              background-color: #fc0000;
              border-radius: 0.9375vw;
              font-size: 1.3vw;
              letter-spacing: -0.02734375vw;
              color: #fff !important;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }

          .type-notice {
            font-size: 23px;
          }
          .type-update {
            color: #0071d4;
          }

          .type-event {
            color: #7b01e5;
          }
        }

        .read-notice {
          > p {
            color: #000;
          }

          .wrap-notice-no {
            .notice-no {
              color: #000;
            }
          }

          .wrap-notice-title {
            .notice-title {
              color: #000;
            }
          }

          .type-update {
            color: #0071d4;
          }

          .type-event {
            color: #7b01e5;
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