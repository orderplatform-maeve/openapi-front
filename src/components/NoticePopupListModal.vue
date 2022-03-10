<template lang="pug">
  .notice-popup-list-modal-container
    .notice-popup-list-modal(
      @touchstart="popupTouchStart"
      @touchend="popupTouchEnd"
    )
      p.notice-popup-list-title 공지
      .wrap-notice-popup-title
        .notice-popup-title
          p.notice-no(v-if="getNoticePopupTopFix") 공지
          p.notice-type [{{getNoticePopupCategory}}]
          p.notice-title {{getNoticePopupTitle}}
          p.is-notice-new(v-if="getNoticePopupNewStatus")
        .notice-popup-writer
          p.notice-writer {{getNoticePopupAuthor}}
          p.notice-write-date {{getNoticePopupCreateDate}}
      .wrap-notice-popup-info
        .notice-popup-info(v-html="getNoticePopupDesc")
        .wrap-notice-popup-page(v-if="!noticeEmergency")
          p(
            v-for="page in getNoticePopupQuantity"
            :key="`popup-page-key-${page}`"
            :class="getNoticePopupPageStyle(page)"
          )
      .wrap-notice-popup-button-list
        button.one-day-no-button(
          @click="oneDayNoPopup"
          v-if="!noticeEmergency"
        ) 하루 동안 보지 않기
        button.close-button(@click="closePopup") 닫기
</template>

<script>
export default {
  props: {
    noticePopupData: {
      type: Array,
      required: true,
    },
    noticePopupPage: {
      type: Number,
      required: true,
    },
    popupTouchStart: {
      type: Function,
      required: true,
    },
    popupTouchEnd: {
      type: Function,
      required: true,
    },
    oneDayNoPopup: {
      type: Function,
      required: true,
    },
    closePopup: {
      type: Function,
      required: true,
    },
    noticeEmergency: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    getNoticePopupTitle() {
      return this.noticePopupData[this.noticePopupPage]?.noticeTitle;
    },
    getNoticePopupCategory() {
      const type = this.noticePopupData[this.noticePopupPage]?.noticeCategory;

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
    getNoticePopupDesc() {
      return this.noticePopupData[this.noticePopupPage]?.noticeDesc;
    },
    getNoticePopupAuthor() {
      return this.noticePopupData[this.noticePopupPage]?.author;
    },
    getNoticePopupCreateDate() {
      return this.noticePopupData[this.noticePopupPage]?.createDate;
    },
    getNoticePopupTopFix() {
      return this.noticePopupData[this.noticePopupPage]?.topFix;
    },
    getNoticePopupNewStatus() {
      return this.noticePopupData[this.noticePopupPage]?.newStatus === 1;
    },
    getNoticePopupQuantity() {
      return this.noticePopupData.length;
    },
  },
  methods: {
    getNoticePopupPageStyle(page) {
      return {
        'notice-popup-page': true,
        'notice-popup-current-page': page - 1 === this.noticePopupPage,
      };
    },
  }
};
</script>

<style scoped lang="scss">
.notice-popup-list-modal-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;

  .notice-popup-list-modal {
    width: 70vw;
    height: 76vh;
    background-color: #fff;
    border-radius: 1.5625vw;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .notice-popup-list-title {
      display: flex;
      align-items: center;
      padding: 1.25vw 1.5625vw !important;
      font-family: "Spoqa Han Sans Neo", "sans-serif";
      font-size: 1.953125vw;
      font-weight: bold;
      background-color: #aaa;
      border-radius: 1.5625vw 1.5625vw 0 0;
    }

    .wrap-notice-popup-title {
      padding: 1.25vw 1.5625vw !important;
      display: flex;
      flex-direction: column;
      gap: 0.390625vw;
      border-bottom: solid 0.078125vw #ddd;
      overflow-y: auto;

      .notice-popup-title {
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

      .notice-popup-writer {
        display: flex;
        align-items: center;
        gap: 0.78125vw;
        font-size: 1.5625vw;
        color: #999;
      }
    }

    .wrap-notice-popup-info {
      display: flex;
      flex-direction: column;
      gap: 0.390625vw;
      font-size: 1.5625vw;
      flex: 1;
      overflow-y: auto;

      .notice-popup-info {
        padding: 1.25vw 1.5625vw !important;
        box-sizing: border-box;
        flex: 1;
      }

      .wrap-notice-popup-page {
        padding: 1.25vw 1.5625vw !important;
        border-bottom: solid 0.078125vw #ddd;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.390625vw;

        .notice-popup-page {
          width: 0.78125vw;
          height: 0.78125vw;
          border-radius: 0.78125vw;
          background-color: #ccc;
        }

        .notice-popup-current-page {
          background-color: #000;
        }
      }
    }

    .wrap-notice-popup-button-list {
      padding: 1.25vw 1.5625vw !important;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4vw;

      > button {
        height: 4.53125vw;
        border: none;
        padding: 0 1.5625vw !important;
      }

      .one-day-no-button {
        background-color: #ccc;
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        font-weight: bold;
        font-size: 2.03125vw;
        color: #fff;
        letter-spacing: -0.05078125vw;
        border: none;
        border-radius: 1.015625vw;
      }

      .close-button {
        border-radius: 1.015625vw;
        background-color: #404144;
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        font-size: 2.03125vw;
        font-weight: bold;
        color: #fff;
      }
    }
  }
}
</style>