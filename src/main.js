import Vue from 'vue';
import VueRouter from 'vue-router';
import VueSocketIO from 'vue-socket.io';
import moment from 'moment';
import VueCookies from 'vue-cookies';

import VCalendar from 'v-calendar';

import App from './App.vue';

import "@babel/polyfill";

import router from '@router';
import { socketConfig } from '@config';
import {
  ConfirmModal,
  OrderModal,
  AuctionModal,
  OptionSoldOutModal,
  TableOrdersModal,
  MenuModal,
  ProductOptionModal,
  FlashMessage,
  AllRefreshModal,
  LeftMenu,
  VerticalLongModal,
  CreditCompanyListModal,
  SelectTableModal,
  SelectDateModal,
  CreditCancelModal,
  CashOutStandingModal,
  OrderCashOutStandingModal,
  CancelCashPaymentModal,
  OptionSaveCheckModal,
  PaymentDetailModal,
  CashCheckOrCancelModal
} from '@components';

import {
  TorderLogo,
  RefreshIcon,
  LogoutIcon,
  UnderArrow,
  UnderWhiteArrow,
  RefreshBlackIcon,
  DeleteIcon,
  PlusButton,
  MinusButton,
  IconExitBlack,
  XWhiteButton,
} from '@svg';

Vue.config.devtools = true;

Vue.use(VueRouter);

const momentPlugins = {
  install: (Vue, name) => {
    name = name || '$moment';
    Object.defineProperty(Vue.prototype, name, { value: moment });
  },
};
Vue.use(momentPlugins);

Vue.use(new VueSocketIO(socketConfig));

Vue.use(VCalendar, {
  componentPrefix: 'vc',
});

Vue.use(VueCookies);
Vue.$cookies.config("1d");

Vue.filter('moment', function (value, format) {
  if (value === null || value === undefined || format === undefined) {
    return '';
  }
  if (format === 'from') {
    return moment(value).fromNow();
  }
  return moment(value).format(format);
});

Vue.component('modal-order', OrderModal);
Vue.component('auction-modal', AuctionModal);
Vue.component('option-sold-out-modal', OptionSoldOutModal) ;
Vue.component('modal-confirm', ConfirmModal);
Vue.component('modal-table-orders', TableOrdersModal);
Vue.component('modal-menu', MenuModal);
Vue.component('modal-product-option', ProductOptionModal);
Vue.component('flash-message', FlashMessage);
Vue.component('modal-all-refresh', AllRefreshModal);
Vue.component('left-menu', LeftMenu);
Vue.component('vertical-long-modal', VerticalLongModal);
Vue.component('credit-company-list-modal', CreditCompanyListModal);
Vue.component('select-table-modal', SelectTableModal);
Vue.component('select-date-modal', SelectDateModal);
Vue.component('credit-cancel-modal', CreditCancelModal);
Vue.component('cash-out-standing-modal', CashOutStandingModal);
Vue.component('order-cash-out-standing-modal', OrderCashOutStandingModal);
Vue.component('cancel-cash-payment-modal', CancelCashPaymentModal);
Vue.component('option-save-check-modal', OptionSaveCheckModal);
Vue.component('payment-detail-modal', PaymentDetailModal);
Vue.component('cash-check-or-cancel-modal', CashCheckOrCancelModal);




Vue.component('icon-torder-logo', TorderLogo);
Vue.component('icon-refresh-icon', RefreshIcon);
Vue.component('icon-logout-icon', LogoutIcon);
Vue.component('icon-under-arrow', UnderArrow);
Vue.component('icon-under-white-arrow', UnderWhiteArrow);
Vue.component('icon-refresh-black-icon', RefreshBlackIcon);
Vue.component('icon-delete-icon', DeleteIcon);
Vue.component('icon-plus-button', PlusButton);
Vue.component('icon-minus-button', MinusButton);
Vue.component('icon-exit-black', IconExitBlack);
Vue.component('icon-x-white-button', XWhiteButton);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
