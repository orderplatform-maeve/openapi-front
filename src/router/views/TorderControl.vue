<template lang="pug">
  .container
    .tab-group
      .tab-name 태블릿 화면
      .tab-buttons
        .tab-button(:class="getOnTabletMonitorClass(device)" @click="openTabletScreen") On
        .tab-button(:class="getOffTabletMonitorClass(device)" @click="closeTabletScreen") Off
    .tab-group
      .tab-name 태블릿 주문
      .tab-buttons
        .tab-button(:class="getOnTabletOrderClass(device)" @click="agreeOrder") On
        .tab-button(:class="getOffTabletOrderClass(device)" @click="rejectOrder") Off
    .tab-group
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
      const confirmModal = {};

      confirmModal.show = true;
      confirmModal.close = this.closeConfirmModal;
      confirmModal.title = '태블릿 열기';
      confirmModal.message = '모든 태블릿의 화면을 열어요';
      confirmModal.confirm = this.reqOpenTablet;

      this.$store.commit('showConfirmModal', confirmModal);
    },
    closeTabletScreen() {
      const confirmModal = {};

      confirmModal.show = true;
      confirmModal.close = this.closeConfirmModal;
      confirmModal.title = '태블릿 닫기';
      confirmModal.message = '모든 태블릿의 화면을 닫아요';
      confirmModal.confirm = this.reqCloseTablet;

      this.$store.commit('showConfirmModal', confirmModal);
    },
    agreeOrder() {
      const confirmModal = {};

      confirmModal.show = true;
      confirmModal.close = this.closeConfirmModal;
      confirmModal.title = '주문 받기';
      confirmModal.message = '태블릿에서 주문을 받아요';
      confirmModal.confirm = this.reqAgreeOrder;

      this.$store.commit('showConfirmModal', confirmModal);
    },
    rejectOrder() {
      const confirmModal = {};

      confirmModal.show = true;
      confirmModal.close = this.closeConfirmModal;
      confirmModal.title = '주문 중단';
      confirmModal.message = '태블릿을 메뉴판으로만 사용하고 주문은 안돼요';
      confirmModal.confirm = this.reqRejectOrder;

      this.$store.commit('showConfirmModal', confirmModal);
    },
    showRecentOrder() {
      const confirmModal = {};

      confirmModal.show = true;
      confirmModal.close = this.closeConfirmModal;
      confirmModal.title = '주문 내역 표시';
      confirmModal.message = '태블릿에서 주문 내역이 나타납니다';
      confirmModal.confirm = this.reqShowOrder;

      this.$store.commit('showConfirmModal', confirmModal);
    },
    hideRecentOrder() {
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
      }
    },
    async reqCloseTablet() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.store_code);

      const response = await this.$store.dispatch('setCloseTablet', fd);

      if (response) {
        this.$store.commit('setDeviceServiceStatus', 1);
        this.closeConfirmModal();
      }
    },
    async reqAgreeOrder() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.store_code);
      const response = await this.$store.dispatch('setAgreeOrder', fd);

      if (response) {
        this.$store.commit('setDeviceOrderStatus', 0);
        this.closeConfirmModal();
      }
    },
    async reqRejectOrder() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.store_code);
      const response = await this.$store.dispatch('setRejectOrder', fd);

      if (response) {
        this.$store.commit('setDeviceOrderStatus', 1);
        this.closeConfirmModal();
      }
    },
    async reqShowOrder() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.store_code);
      const response = await this.$store.dispatch('setShowRecentOrder', fd);

      if (response) {
        this.$store.commit('setDeviceRecentOrderStatus', 0);
        this.closeConfirmModal();
      }
    },
    async reqHideOrder() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.store_code);
      const response = await this.$store.dispatch('setCloseRecentOrder', fd);

      if (response) {
        this.$store.commit('setDeviceRecentOrderStatus', 1);
        this.closeConfirmModal();
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
@import "../../scss/global.scss";
@include tab-group;

.tab-group {
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
    background-color:#121212;
    color:#ffffff;
    align-items: center;
    justify-content: center;
    text-decoration:none;
    margin-bottom: 12px;
  }
}

</style>
