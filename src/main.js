import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import VueCookies from 'vue-cookies'
import VueFilter from 'vue-filter';
import VueSocketIO from 'vue-socket.io'
import VueMoment from 'vue-moment'

Vue.prototype.$eventBus = new Vue();

Vue.use(Vuex)
Vue.use(VueCookies);
Vue.use(VueRouter);
Vue.use(VueFilter); 
Vue.use(VueMoment);

import OrderView from './OrderView.vue'
import Member from './Member.vue'
import Store from './Store.vue'
import Table from './Table.vue'
import Logout from './Logout.vue'
import OrderList from './OrderList.vue'
import OrderDetail from './OrderDetail.vue'
import ModalConfirm from './ConfirmModal.vue'


Vue.use(new VueSocketIO({
    //debug: true,
    connection: 'http://1.socketio.orderview.torder.co.kr',
}))
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
});

Vue.component('order-detail', OrderDetail)
Vue.component('modal-confirm', ModalConfirm)

/*
new Vue({
  //el: '#order',
  render: h => h(Order)
})
*/

let routes = [{
  path: '/',
  component: OrderView,
  store,
  children: [{
    path: 'member',
    name: 'member',
    component: Member,
  }, {
    path: 'store',
    name: 'store',
    component: Store,
  }, {
    path: 'table',
    name: 'table',
    component: Table,
  }, {
    path: 'order',
    name: 'order',
    component: OrderList,
  }, {
    path: 'logout',
    name: 'logout',
    component: Logout,
  }]
}];

let router = new VueRouter({
  //mode: 'history',
  scrollBehavior:() => ({y:0}),
  routes: routes,
});

new Vue({
  router
}).$mount("#app");
