<template lang="pug">
  .container
    .tab-groups
      .tab-name 태블릿 화면
      .tab-buttons
        .tab-button(:class="getOnTabletMonitorClass(device)" @click="openTabletScreen") On
        .tab-button(:class="getOffTabletMonitorClass(device)" @click="closeTabletScreen") Off
    .tab-groups
      .tab-name 태블릿 주문
      .tab-buttons
        .tab-button(:class="getOnTabletOrderClass(device)" @click="agreeOrder") On
        .tab-button(:class="getOffTabletOrderClass(device)" @click="rejectOrder") Off
    .tab-groups
      .tab-name 주문 내역
      .tab-buttons
        .tab-button(:class="getOnTabletRecentOrderClass(device)" @click="showRecentOrder") On
        .tab-button(:class="getOffTabletRecentOrderClass(device)" @click="hideRecentOrder") Off
</template>

<script>
export default {
  data() {
    return {
      confirmModal: {
        show: false,
        close: () => {},
        title: '',
        message: '',
      },
    };
  },
  computed: {
    auth() {
      return this.$store.state.auth;
    },
    device() {
      return this.$store.state.device;
    },
  },
  methods: {
    openTabletScreen() {
      if (!this.$store.state.device.serviceStatus) {
        return this.$store.commit('pushFlashMessage', '이미 태블릿 열기 상태로 되어있습니다.');
      }

      const confirmModal = {};

      confirmModal.show = true;
      confirmModal.close = this.closeConfirmModal;
      confirmModal.title = '태블릿 열기';
      confirmModal.message = '모든 태블릿의 화면을 열어요';
      confirmModal.confirm = this.reqOpenTablet;

      this.$store.commit('showConfirmModal', confirmModal);
    },
    closeTabletScreen() {
      if (this.$store.state.device.serviceStatus) {
        return this.$store.commit('pushFlashMessage', '이미 태블릿 닫기 상태로 되어있습니다.');
      }

      const confirmModal = {};

      confirmModal.show = true;
      confirmModal.close = this.closeConfirmModal;
      confirmModal.title = '태블릿 닫기';
      confirmModal.message = '모든 태블릿의 화면을 닫아요';
      confirmModal.confirm = this.reqCloseTablet;

      this.$store.commit('showConfirmModal', confirmModal);
    },
    agreeOrder() {
      if (!this.$store.state.device.orderStatus) {
        return this.$store.commit('pushFlashMessage', '이미 주문 받기 상태로 되어있습니다.');
      }

      const confirmModal = {};

      confirmModal.show = true;
      confirmModal.close = this.closeConfirmModal;
      confirmModal.title = '주문 받기';
      confirmModal.message = '태블릿에서 주문을 받아요';
      confirmModal.confirm = this.reqAgreeOrder;

      this.$store.commit('showConfirmModal', confirmModal);
    },
    rejectOrder() {
      if (this.$store.state.device.orderStatus) {
        return this.$store.commit('pushFlashMessage', '이미 주문 중단 상태로 되어있습니다.');
      }

      const confirmModal = {};

      confirmModal.show = true;
      confirmModal.close = this.closeConfirmModal;
      confirmModal.title = '주문 중단';
      confirmModal.message = '태블릿을 메뉴판으로만 사용하고 주문은 안돼요';
      confirmModal.confirm = this.reqRejectOrder;

      this.$store.commit('showConfirmModal', confirmModal);
    },
    showRecentOrder() {
      if (!this.$store.state.device.recentOrderStatus) {
        return this.$store.commit('pushFlashMessage', '이미 주문 내역 표시 상태로 되어있습니다.');
      }

      const confirmModal = {};

      confirmModal.show = true;
      confirmModal.close = this.closeConfirmModal;
      confirmModal.title = '주문 내역 표시';
      confirmModal.message = '태블릿에서 주문 내역이 나타납니다';
      confirmModal.confirm = this.reqShowOrder;

      this.$store.commit('showConfirmModal', confirmModal);
    },
    hideRecentOrder() {
      if (this.$store.state.device.recentOrderStatus) {
        return this.$store.commit('pushFlashMessage', '이미 주문 내역 숨김 상태로 되어있습니다.');
      }

      const confirmModal = {};

      confirmModal.show = true;
      confirmModal.close = this.closeConfirmModal;
      confirmModal.title = '주문 내역 숨김';
      confirmModal.message = '태블릿에서 주문 내역이 숨겨집니다';
      confirmModal.confirm = this.reqHideOrder;

      this.$store.commit('showConfirmModal', confirmModal);
    },
    closeConfirmModal() {
      this.$store.commit('closeConfirmModal');
    },
    async reqOpenTablet() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.store_code);

      const response = await this.$store.dispatch('setOpenTablet', fd);

      if (response) {
        this.$store.commit('setDeviceServiceStatus', 0);
        this.closeConfirmModal();
        this.$store.commit('pushFlashMessage', '태블릿 화면 열기 상태로 변경 되었습니다.');
      }
    },
    async reqCloseTablet() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.store_code);

      const response = await this.$store.dispatch('setCloseTablet', fd);

      if (response) {
        this.$store.commit('setDeviceServiceStatus', 1);
        this.closeConfirmModal();
        this.$store.commit('pushFlashMessage', '태블릿 화면 닫기 상태로 변경 되었습니다.');
      }
    },
    async reqAgreeOrder() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.store_code);
      const response = await this.$store.dispatch('setAgreeOrder', fd);

      if (response) {
        this.$store.commit('setDeviceOrderStatus', 0);
        this.closeConfirmModal();
        this.$store.commit('pushFlashMessage', '태블릿 주문 받기 상태로 변경 되었습니다.');
      }
    },
    async reqRejectOrder() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.store_code);
      const response = await this.$store.dispatch('setRejectOrder', fd);

      if (response) {
        this.$store.commit('setDeviceOrderStatus', 1);
        this.closeConfirmModal();
        this.$store.commit('pushFlashMessage', '태블릿 주문 중단 상태로 변경 되었습니다.');
      }
    },
    async reqShowOrder() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.store_code);
      const response = await this.$store.dispatch('setShowRecentOrder', fd);

      if (response) {
        this.$store.commit('setDeviceRecentOrderStatus', 0);
        this.closeConfirmModal();
        this.$store.commit('pushFlashMessage', '태블릿 주문 내역 표시 상태로 변경 되었습니다.');
      }
    },
    async reqHideOrder() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.store_code);
      const response = await this.$store.dispatch('setCloseRecentOrder', fd);

      if (response) {
        this.$store.commit('setDeviceRecentOrderStatus', 1);
        this.closeConfirmModal();
        this.$store.commit('pushFlashMessage', '태블릿 주문 내역 숨김 상태로 변경 되었습니다.');
      }
    },
    getOnTabletMonitorClass(device) {
      const active = !this.vaildServiceStatus(device);

      return {
        active,
      };
    },
    getOffTabletMonitorClass(device) {
      const active = this.vaildServiceStatus(device);

      return {
        active,
      };
    },
    vaildServiceStatus(device) {
      return device && device.serviceStatus;
    },
    getOnTabletOrderClass(device) {
      const active = !this.vaildOrderStatus(device);

      return {
        active,
      };
    },
    getOffTabletOrderClass(device) {
      const active = this.vaildOrderStatus(device);

      return {
        active,
      };
    },
    vaildOrderStatus(device) {
      return device && device.orderStatus;
    },
    getOnTabletRecentOrderClass(device) {
      const active = !this.vaildRecentOrderStatus(device);

      return {
        active,
      };
    },
    getOffTabletRecentOrderClass(device) {
      const active = this.vaildRecentOrderStatus(device);

      return {
        active,
      };
    },
    vaildRecentOrderStatus(device) {
      return device && device.recentOrderStatus;
    },
  },
};
</script>

<style lang="scss">

  .tab-groups {
    display:flex;
    overflow:scroll;
    width: 100%;
    width: -webkit-fill-available;

    .tab-name {
      align-items: center;
      justify-content: center;
      display:flex;
      flex-direction: row;
      font-weight:400;
      font-size:20px;
      height:40px;
    }
    .tab-buttons {
      display:inline-flex;
      margin:0px;
      padding:0;
      height:52px;
      background-color:#484848;
      border-radius:100px;
      flex-grow:1;

      .tab-button {
        display:flex;
        height:100%;
        flex-grow:1;
        flex-shrink:0;
        align-items: center;
        justify-content: center;
        text-align:center;
        font-weight:900;
        background-color:#484848;
        color:#ffffff;
        padding:0 12px;
        white-space: nowrap;
        font-size: 20px;

        .count {
          margin-left:8px;
          display:flex;
          align-items: center;
          justify-content: center;
          padding:2px 8px;
          background-color:#ffffff;
          color:#000000;
          border-radius:100px;
          font-size:20px;
        }
      }
      .tab-button:first-child {
        border-top-left-radius: 100px;
        border-bottom-left-radius: 100px;
      }
      .tab-button:last-child {
        border-top-right-radius: 100px;
        border-bottom-right-radius: 100px;
      }
      .tab-button.active {
        background-color:#fafafa;
        color:#000000;
        border-radius:100px;

        .count {
        background-color:#000000;
        color:#fafafa;
        }
      }
    }

  }



.tab-groups {
  flex-direction:column;
  margin-top:24px;
  flex-grow:0;
  .tab-name {
    display:flex;
    height:40px;
    padding:0 24px;
    font-size:28px;
    font-weight:900;
    border-radius:200px;
    background-color: transparent;
    color:#ffffff;
    align-items: center;
    justify-content: center;
    text-decoration:none;
    margin-bottom: 12px;
  }
}

</style>
