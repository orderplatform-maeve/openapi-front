<template lang="pug">
.logout-secret-container
  LogoutConfirmModal(
    v-if="isVisibleLogoutConfirmModal"
    :noAction="closeVisibleLogoutConfirmModal"
    :yesAction="logout"
  )
  .wrap-logout-secret-header
    .logout-secret-title 기능
    .button.md-close-button(@click="close")
      CloseText
  .function-list
    .function-item(@click="openVisibleLogoutConfirmModal") 로그아웃
    .function-item(@click="goSelectStore") 매장선택
</template>

<script>
import {
  CloseText
} from '@svg';

import LogoutConfirmModal from '@components/LogoutConfirmModal';

export default {
  components: {
    CloseText,
    LogoutConfirmModal
  },
  props: {
    logout: {
      type: Function,
      required: true,
    },
    goSelectStore: {
      type: Function,
      required: true,
    },
    close: {
      type: Function,
      required: true,
    },
    isVisibleLogoutConfirmModal: {
      type: Boolean,
      required: true,
    },
    openVisibleLogoutConfirmModal: {
      type: Function,
      required: true,
    },
    closeVisibleLogoutConfirmModal: {
      type: Function,
      required: true,
    }
  }
};
</script>

<style lang="scss" scoped>
.logout-secret-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;

  .wrap-logout-secret-header {
    margin-top: 1.5625vw !important;
    display: flex;
    align-items: center;
    color: #fff;
    padding: 0 2.34375vw !important;

    .logout-secret-title {
      flex: 1;
      font-size: 3vw;
      color: #fff;
      border-bottom: 0.1vw solid #fff;
    }
  }

  .function-list {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2vw;

    .function-item {
      height: 5vw;
      padding: 0 6vw !important;
      background-color: #fafafa;
      color: #202020;
      font-size: 2vw;
      font-weight: 900;
      border-radius: 100vw;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
