<template lang="pug">
  .notice-popup-list-modal-container
    .notice-popup-list-modal(
      @touchstart="popupTouchStart"
      @touchend="popupTouchEnd"
    )
      .wrap-notice-popup-title
        .notice-popup-title
          .wrap-notice-no(v-if="getNoticePopupTopFix")
            p.notice-no 공지
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
        ) 오늘 하루 보지 않기
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

    .wrap-notice-popup-title {
      padding: 2.34375vw 2.34375vw 1.5625vw !important;
      display: flex;
      flex-direction: column;
      gap: 0.78125vw;
      border-bottom: solid 0.078125vw #fc0000;

      .notice-popup-title {
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

      .notice-popup-writer {
        display: flex;
        align-items: center;
        gap: 0.78125vw;
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        font-size: 1.25vw;
        color: #666;
        box-sizing: border-box;
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
    }

    .wrap-notice-popup-page {
      padding: 1.171875vw 0 !important;
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

    .wrap-notice-popup-button-list {
      padding: 1.5625vw !important;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.5625vw;

      > button {
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        width: 18.4375vw;
        height: 4.53125vw;
        padding: 0 1.5625vw !important;
        font-size: 2.03125vw;
        letter-spacing: -0.1015625vw;
        border-radius: 1.015625vw;
        border: none;
        box-sizing: border-box;
      }

      .one-day-no-button {
        color: #666;
        background-color: #e5e5e5;
      }

      .close-button {
        color: #fff;
        background-color: #12151d;
      }
    }
  }
}
</style>