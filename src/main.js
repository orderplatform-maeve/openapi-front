import Vue from 'vue';
import VueRouter from 'vue-router';
import VueSocketIO from 'vue-socket.io';
import moment from 'moment';

import VCalendar from 'v-calendar';

import App from './App.vue';

import "@babel/polyfill";

import router from '@router';
import { socketConfig } from '@config';
import {
  ConfirmModal,
  OrderModal,
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
} from '@components';

import {
  TorderLogo,
  RefreshIcon,
  LogoutIcon,
  UnderArrow,
  RefreshBlackIcon,
  DeleteIcon,
  PlusButton,
  MinusButton,
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

Vue.component('icon-torder-logo', TorderLogo);
Vue.component('icon-refresh-icon', RefreshIcon);
Vue.component('icon-logout-icon', LogoutIcon);
Vue.component('icon-under-arrow', UnderArrow);
Vue.component('icon-refresh-black-icon', RefreshBlackIcon);
Vue.component('icon-delete-icon', DeleteIcon);
Vue.component('icon-plus-button', PlusButton);
Vue.component('icon-minus-button', MinusButton);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
