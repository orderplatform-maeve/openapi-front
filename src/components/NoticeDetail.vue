<template lang="pug">
  .notice-detail-container
    send-file-modal(
      v-if="sendFileModalVisible"
      :fileList="sendFileList"
      :phoneNumber="phoneNumber"
      :updatePhoneNumber="updatePhoneNumber"
      :cancelSendFile="cancelSendFile"
      :sendFile="sendFile"
    )
    p.notice-detail-header 상세내용
    .wrap-notice-detail-title
      .notice-detail-title
        p.notice-no(v-if="isMainNotice") 공지
        p.notice-type [{{noticeType}}]
        p.notice-title {{noticeTitle}}
        p.is-notice-new(v-if="isNoticeNew")
      .notice-detail-writer
        p.notice-writer {{noticeAuthor}}
        p.notice-write-date {{noticeWriteDate}}
    .wrap-notice-detail-info(v-html="noticeContents")
    .wrap-notice-file-all-list
      .wrap-notice-list-title
        p.notice-list-title 첨부파일 (총 {{this.getFileQuantity}}개)
        p.notice-file-notion 선택하신 첨부파일은 카카오 알림톡으로 전송됩니다.
      .wrap-notice-file-list
        .notice-file-list(v-for="(file, index) in noticeFileList" :key="`file-key-${index}`")
          .notice-file
            label.notice-file-title
              input.notice-file-check(type="checkbox" :value="index" v-model="getFileCheckboxList")
              paper-clip
              p.file-info {{getFileName(file)}} ({{getFileSize(file)}}MB)
    .wrap-file-send-button
      button.select-send(
        @click="sendCheckFileModal"
      ) 선택 전송
      button.all-send(
        @click="sendAllFileModal"
      ) 전체 전송
    .wrap-back-notice-page
      button(@click="goNoticeList") 목록
</template>

<script>
import {
  PaperClip
} from '@svg';

import SendFileModal from '@components/SendFileModal.vue';

export default {
  components: {
    PaperClip,
    SendFileModal,
  },
  props: {
    isMainNotice: {
      type: Boolean,
      required: true,
    },
    noticeType: {
      type: String,
      required: true,
    },
    noticeTitle: {
      type: String,
      required: true,
    },
    isNoticeNew: {
      type: Number,
      required: true,
    },
    noticeAuthor: {
      type: String,
      required: true,
    },
    noticeWriteDate: {
      type: String,
      required: true,
    },
    noticeContents: {
      type: String,
      required: true,
    },
    noticeFileList: {
      type: Array,
      required: true,
    },
    goNoticeList: {
      type: Function,
      required: true,
    },
    fileCheckboxList: {
      type: Array,
      required: true,
    },
    updateFileCheckbox: {
      type: Function,
      required: true,
    },
    sendCheckFileModal: {
      type: Function,
      required: true,
    },
    sendAllFileModal: {
      type: Function,
      required: true,
    },
    sendFileModalVisible: {
      type: Boolean,
      required: true,
    },
    sendFileList: {
      type: Array,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    updatePhoneNumber: {
      type: Function,
      required: true,
    },
    sendFile: {
      type: Function,
      required: true,
    },
    cancelSendFile: {
      type: Function,
      required: true,
    }
  },
  computed: {
    getFileQuantity() {
      return this.noticeFileList.length;
    },
    getFileCheckboxList: {
      get() {
        return this.fileCheckboxList;
      },
      set(value){
        this.updateFileCheckbox(value);
      }
    }
  },
  methods: {
    getFileName(file) {
      return file.fileName;
    },
    getFileSize(file) {
      return file.fileSize;
    },
    getFilePath(file) {
      return file.filePath;
    }
  }
};
</script>

<style scoped lang="scss">
.notice-detail-container {
  flex: 1;
  width: 84.53125vw;
  background-color: #fff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  .notice-detail-header {
    display: flex;
    align-items: center;
    padding: 1.25vw 1.5625vw !important;
    font-family: 'Spoqa Han Sans Neo', 'sans-serif';
    font-size: 1.953125vw;
    font-weight: bold;
    background-color: #aaa;
  }

  .wrap-notice-detail-title {
    padding: 1.25vw 1.5625vw !important;
    display: flex;
    flex-direction: column;
    gap: 0.390625vw;
    border-bottom: solid 0.078125vw #ddd;

    .notice-detail-title {
      display: flex;
      align-items: center;
      gap: 0.78125vw;

      > p {
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        font-size: 1.953125vw;
        font-weight: bold;
      }

      .notice-no {
        font-size: 1.5625vw;
        background-color: #fc0000;
        border-radius: 0.234375vw;
        color: #fff;
        padding: 0.390625vw 0.9375vw !important;
        box-sizing: border-box;
      }

      .notice-type {
        color: #666;
      }
    }

    .notice-detail-writer {
      display: flex;
      align-items: center;
      gap: 0.78125vw;
      font-size: 1.5625vw;
      color: #999;
    }
  }

  .wrap-notice-detail-info {
    display: flex;
    flex-direction: column;
    gap: 0.390625vw;
    padding: 1.25vw 1.5625vw !important;
    font-size: 1.5625vw;
    flex: 1;
    border-bottom: solid 0.078125vw #ddd;
  }

  .wrap-notice-file-all-list {
    font-size: 1.25vw;
    border-bottom: solid 0.078125vw #ddd;
    display: flex;
    flex-direction: column;
    gap: 0.390625vw;

    .wrap-notice-list-title {
      border-bottom: solid 0.078125vw #ddd;
      padding: 1.25vw 1.5625vw !important;
      display: flex;
      flex-direction: column;
      gap: 0.390625vw;

      .notice-list-title {
        box-sizing: border-box;
        font-weight: bold;
        font-size: 1.25vw;
      }
      .notice-file-notion {
        font-size: 1.015625vw;
        color: #aaa;
      }
    }

    .wrap-notice-file-list {
      display: flex;
      flex-direction: column;
      gap: 0.78125vw;
      padding: 1.25vw 1.5625vw !important;

      .notice-file-list {
        box-sizing: border-box;

        .notice-file {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .notice-file-title {
            display: flex;
            align-items: center;
            gap: 0.390625vw;

            .notice-file-check {
              width: 1.171875vw;
              height: 1.171875vw;
            }
          }

          .notice-file-send {
            width: 7.8125vw;
            height: 2.96875vw;
            font-size: 1.25vw;
            font-weight: bold;
            color: #fff;
            letter-spacing: -0.7px;
            cursor: pointer;
            background-color: #2f2f39;
            border: none;
            border-radius: 5px;
          }
        }
      }
    }
  }
  .wrap-file-send-button {
    padding: 1.25vw 1.5625vw !important;
    display: flex;
    gap: 10px;

    > button {
      width: 8vw;
      height: 2.4vw;
      font-size: 1.25vw;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 1.015625vw;
      border: none;
    }

    .select-send {
      background-color: #aaa;
      color: #fff;
    }

    .all-send {
      background-color: #12151d;
      color: #fff;
    }
  }

  .wrap-back-notice-page {
    padding: 1.25vw 1.5625vw !important;
    display: flex;
    align-items: center;
    justify-content: center;

    > button {
      width: 6.25vw;
      height: 2.96875vw;
      font-size: 1.25vw;
      font-weight: bold;
      color: #fff;
      letter-spacing: -0.7px;
      cursor: pointer;
      background-color: #2f2f39;
      border: none;
      border-radius: 5px;
    }
  }
}

</style>