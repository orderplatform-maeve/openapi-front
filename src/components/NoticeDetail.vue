<template lang="pug">
  .notice-detail-container
    p.notice-detail-header 공지사항 상세
    .wrap-notice-detail-title
      .notice-detail-title
        .wrap-notice-no(v-if="isMainNotice")
          p.notice-no 공지
        p.notice-type [{{noticeType}}]
        p.notice-title {{noticeTitle}}
        p.is-notice-new(v-if="isNoticeNew")
      .notice-detail-writer
        p.notice-writer {{noticeAuthor}}
        p.notice-write-date {{noticeWriteDate}}
    .wrap-notice-detail-info
      .notice-detail-info(v-html="noticeContents")
      .wrap-notice-file-all-list(v-if="getFileQuantity")
        .wrap-notice-list-title
          p.notice-list-title 첨부파일 (총 {{this.getFileQuantity}}개)
          p.notice-file-notion 선택하신 첨부파일은 카카오 알림톡으로 전송됩니다.
        .wrap-notice-file-list
          .notice-file-list(v-for="(file, index) in noticeFileList" :key="`file-key-${index}`")
            input.notice-file-check(type="checkbox" :value="index" v-model="getFileCheckboxList" :id="`file-${index}`")
            label.notice-file-title(:for="`file-${index}`")
              p.file-info {{getFileName(file)}} ({{getFileSize(file)}}MB)
        .wrap-file-send-button(v-if="getFileQuantity")
          button.select-send(
            @click="sendCheckFileModal"
          ) 선택 전송
          button.all-send(
            @click="sendAllFileModal"
          ) 전체 전송
    .wrap-back-notice-page
      button(@click="goNoticeList") 목록으로 돌아가기
</template>

<script>
import {
  PaperClip
} from '@svg';

export default {
  components: {
    PaperClip,
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
    padding: 1.5625vw !important;
    font-family: 'Spoqa Han Sans Neo', 'sans-serif';
    font-size: 1.5625vw;
    box-sizing: border-box;
  }

  .wrap-notice-detail-title {
    padding: 0 1.5625vw !important;
    display: flex;
    flex-direction: column;
    gap: 0.78125vw;

    .notice-detail-title {
      display: flex;
      align-items: center;
      gap: 0.78125vw;

      > p {
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        font-size: 1.875vw;
        font-weight: bold;
      }

      .wrap-notice-no {
        display: flex;
        justify-content: center;
        align-items: center;
        .notice-no {
          width: 3.75vw;
          height: 1.875vw;
          font-family: 'Spoqa Han Sans Neo', 'sans-serif';
          background-color: #fc0000;
          border-radius: 0.9375vw;
          font-size: 1.09375vw;
          letter-spacing: -0.02734375vw;
          color: #fff !important;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }

    .notice-detail-writer {
      padding-bottom: 1.1328125vw !important;
      border-bottom: solid 0.078125vw #ddd;
      display: flex;
      align-items: center;
      gap: 0.78125vw;
      font-family: 'Spoqa Han Sans Neo', 'sans-serif';
      font-size: 1.25vw;
      color: #666;
      box-sizing: border-box;
    }
  }

  .wrap-notice-detail-info {
    padding: 1.25vw 1.5625vw !important;
    font-size: 1.5625vw;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2.34375vw;
    overflow-y: auto;

    .notice-detail-info {
      flex: 1;
    }

    .wrap-notice-file-all-list {
      padding: 1.25vw !important;
      box-sizing: border-box;
      border-radius: 0.78125vw;
      background-color: #eff0f2;

      .wrap-notice-list-title {
        display: flex;
        flex-direction: column;
        gap: 0.78125vw;
        padding-bottom: 0.7421875vw !important;
        box-sizing: border-box;
        border-bottom: solid 0.078125vw #ccc;

        .notice-list-title {
          font-size: 1.25vw;
          font-weight: bold;
          letter-spacing: -0.0625vw;
          color: #000;
        }

        .notice-file-notion {
          font-size: 1.09375vw;
          color: #666;
        }
      }

      .wrap-notice-file-list {
        margin-top: 1.5625vw !important;
        display: flex;
        flex-direction: column;
        gap: 0.78125vw;

        .notice-file-list {
          display: flex;
          align-items: center;
          gap: 0.78125vw;

          input[type="checkbox"]+label {
            display: block;
            background-size: 1.875vw 1.875vw;
            padding-left: 2.734375vw !important;
            background: url('https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/icons/check_off_icon.svg') no-repeat 0 1px / contain;
          }

          input[type='checkbox']:checked+label {
            background-size: 1.875vw 1.875vw;
            padding-left: 2.734375vw !important;
            background: url('https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/icons/check_on_icon.svg') no-repeat 0 1px / contain;
          }


          .notice-file-check {
            display: none;
          }
        }
      }

      .wrap-file-send-button {
        margin-top: 2.265625vw !important;
        display: flex;
        align-items: center;
        gap: 0.78125vw;

        > button {
          width: 8.90625vw;
          height: 2.96875vw;
          border-radius: 0.390625vw;
          border: solid 0.15625vw #000;
          background-color: #fff;
          box-sizing: border-box;
          font-size: 1.40625vw;
        }

        .all-send {
          background-color: #12151d;
          color: #fff;
          border: none;
        }
      }

      // input[type="checkbox"]:checked+label {
      //   background-image: url('https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/icons/check_on_icon.svg') !important;
      //   background-size: contain !important;
      //   background-repeat: no-repeat !important;
      // }
    }
  }

  .wrap-back-notice-page {
    border-top: solid 0.078125vw #ddd;
    padding: 1.25vw !important;
    display: flex;
    align-items: center;
    height: 6.09375vw;
    box-sizing: border-box;

    > button {
      height: 2.96875vw;
      font-family: 'Spoqa Han Sans Neo', 'sans-serif';
      font-size: 1.40625vw;
      color: #fff;
      cursor: pointer;
      background-color: #12151d;;
      border: none;
      border-radius: 5px;
      padding: 0 1.171875vw;
      box-sizing: border-box;
    }
  }
}

</style>