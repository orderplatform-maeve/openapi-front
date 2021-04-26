<template lang="pug">
#orderview
  alert-modal(v-if="isAlertModal")
  .popup.item.cashOutstanding(v-if="requestCashItem")
    p.tit 현금미결제
    .content
      .row
        .left
          dl
            dt 주문금액 :
            dd {{requestCashItem.amount}}
          dl
            dt 승인번호 :
            dd {{requestCashItem.paymentId}}
          dl
            dt 주문일시 :
            dd {{requestCashItem.orderdateTime}}
        .right
          dl(v-for="p in requestCashItem.orderInfo")
            dt
              .name {{p.display_name}}
              .option(v-if="p.option")
                div(v-for="option in p.option") {{option.display_name}} {{option.order_qty}}개

            dd {{p.good_qty}}개
      .row
        .message 테이블에서<br/>현금 수납이 확인되었습니까?
    .button-group
      .button(v-on:click.stop="closeRequestItemModal();") 닫기
      .button.on(v-on:click.stop="cashCommit(requestCashItem);") 확인
  .dimBg(v-if="requestCashItem")

  modal-order(v-if="order")
  .dimBg(v-if="order")
  modal-all-refresh(
    :show="visibleAllRefreshModal"
    :close="onCloseAllRefreshModal"
    :data="allRefreshList"
  )
  flash-message
  modal-confirm(
    :show="confirmModal.show"
    :close="confirmModal.close"
    :title="confirmModal.title"
    :message="confirmModal.message"
    :confirm="confirmModal.confirm"
  )
  .left_wrap.new.left_wrap
    router-view(
      :auth="auth"
      :orders="orders"
      :stores="stores"
      :time="time"
    )
    //.top_menu
      .menu.active
        | &#xBAA8;&#xB4E0; &#xC8FC;&#xBB38;
        span 10
      .menu
        | &#xBBF8;&#xD655;&#xC778; &#xC8FC;&#xBB38;
        span 1
      .menu
        | &#xD655;&#xC778; &#xC8FC;&#xBB38;
        span 0
    //.list_box
      ul.order_list
        li
          a(href='')
            .tn.bg_red A-01
            .txt1 &#xCCAB;&#xC8FC;&#xBB38;
            .check.on &#xD655;&#xC778;
            .txt2 &#xC120;&#xBD88;
            .txt3 &#xD604;&#xAE08;
            .date 2021-02-10 11:13:20
            .btn_orderList &#xC8FC;&#xBB38;&#xB0B4;&#xC5ED;
        li
          a(href='')
            .tn.bg_blue A-02
            .txt1 &#xD638;&#xCD9C;&#xC774;&#xC694;
            .check.on &#xD655;&#xC778;
            .txt2 &#xC120;&#xBD88;
            .txt4 &#xD604;&#xAE08;&#xBBF8;&#xACB0;&#xC81C;
            .date 2021-02-10 11:13:20
            .btn_orderList &#xC8FC;&#xBB38;&#xB0B4;&#xC5ED;
        li
          a(href='')
            .tn.bg_blue A-03
            .txt1 &#xD638;&#xCD9C;&#xC774;&#xC694;
            .check.on &#xD655;&#xC778;
            .txt2 &#xC120;&#xBD88;
            .txt3 &#xCE74;&#xB4DC;+&#xD604;&#xAE08;
            .date 2021-02-10 11:13:20
            .btn_orderList &#xC8FC;&#xBB38;&#xB0B4;&#xC5ED;
        li
          a(href='')
            .tn.bg_yellow A-03
            .txt1 &#xD3C9;&#xAC00;
            .check.on &#xD655;&#xC778;
            .txt2 &#xC120;&#xBD88;
            .txt3 &#xCE74;&#xB4DC;+&#xD604;&#xAE08;
            .date 2021-02-10 11:13:20
            .btn_orderList &#xC8FC;&#xBB38;&#xB0B4;&#xC5ED;
        li
          a(href='')
            .tn.bg_green A-03
            .txt1 &#xC138;&#xD305;&#xC644;&#xB8CC;
            .check &#xBBF8;&#xD655;&#xC778;
            .txt2 &#xC120;&#xBD88;
            .txt4 &#xD604;&#xAE08;&#xBBF8;&#xACB0;&#xC81C;
            .date 2021-02-10 11:13:20
            .btn_orderList &#xC8FC;&#xBB38;&#xB0B4;&#xC5ED;
        li
          a(href='')
            .tn.bg_red A-03
            .txt1 &#xC8FC;&#xBB38;&#xC774;&#xC694;
            .check &#xBBF8;&#xD655;&#xC778;
            .txt2 &#xC120;&#xBD88;
            .txt3 &#xCE74;&#xB4DC;+&#xD604;&#xAE08;
            .date 2021-02-10 11:13:20
            .btn_orderList &#xC8FC;&#xBB38;&#xB0B4;&#xC5ED;
        li
          a(href='')
            .tn.bg_red A-03
            .txt1 &#xC8FC;&#xBB38;&#xC774;&#xC694;
            .check &#xBBF8;&#xD655;&#xC778;
            .txt2 &#xC120;&#xBD88;
            .txt3 &#xCE74;&#xB4DC;+&#xD604;&#xAE08;
            .date 2021-02-10 11:13:20
            .btn_orderList &#xC8FC;&#xBB38;&#xB0B4;&#xC5ED;
        li
          a(href='')
            .tn.bg_red A-03
            .txt1 &#xC8FC;&#xBB38;&#xC774;&#xC694;
            .check &#xBBF8;&#xD655;&#xC778;
            .txt2 &#xC120;&#xBD88;
            .txt3 &#xCE74;&#xB4DC;+&#xD604;&#xAE08;
            .date 2021-02-10 11:13:20
            .btn_orderList &#xC8FC;&#xBB38;&#xB0B4;&#xC5ED;
        li
          a(href='')
            .tn.bg_red A-03
            .txt1 &#xC8FC;&#xBB38;&#xC774;&#xC694;
            .check &#xBBF8;&#xD655;&#xC778;
            .txt2 &#xC120;&#xBD88;
            .txt3 &#xCE74;&#xB4DC;+&#xD604;&#xAE08;
            .date 2021-02-10 11:13:20
            .btn_orderList &#xC8FC;&#xBB38;&#xB0B4;&#xC5ED;
        li
          a(href='')
            .tn.bg_red A-03
            .txt1 &#xC8FC;&#xBB38;&#xC774;&#xC694;
            .check &#xBBF8;&#xD655;&#xC778;
            .txt2 &#xC120;&#xBD88;
            .txt3 &#xCE74;&#xB4DC;+&#xD604;&#xAE08;
            .date 2021-02-10 11:13:20
            .btn_orderList &#xC8FC;&#xBB38;&#xB0B4;&#xC5ED;
        li
          a(href='')
            .tn.bg_red A-03
            .txt1 &#xC8FC;&#xBB38;&#xC774;&#xC694;
            .check &#xBBF8;&#xD655;&#xC778;
            .txt2 &#xC120;&#xBD88;
            .txt3 &#xCE74;&#xB4DC;+&#xD604;&#xAE08;
            .date 2021-02-10 11:13:20
            .btn_orderList &#xC8FC;&#xBB38;&#xB0B4;&#xC5ED;
        li
          a(href='')
            .tn.bg_red A-03
            .txt1 &#xC8FC;&#xBB38;&#xC774;&#xC694;
            .check &#xBBF8;&#xD655;&#xC778;
            .txt2 &#xC120;&#xBD88;
            .txt3 &#xCE74;&#xB4DC;+&#xD604;&#xAE08;
            .date 2021-02-10 11:13:20
            .btn_orderList &#xC8FC;&#xBB38;&#xB0B4;&#xC5ED;
        li
          a(href='')
            .tn.bg_red A-03
            .txt1 &#xC8FC;&#xBB38;&#xC774;&#xC694;
            .check &#xBBF8;&#xD655;&#xC778;
            .txt2 &#xC120;&#xBD88;
            .txt3 &#xCE74;&#xB4DC;+&#xD604;&#xAE08;
            .date 2021-02-10 11:13:20
            .btn_orderList &#xC8FC;&#xBB38;&#xB0B4;&#xC5ED;
        li
          a(href='')
            .tn.bg_red A-03
            .txt1 &#xC8FC;&#xBB38;&#xC774;&#xC694;
            .check &#xBBF8;&#xD655;&#xC778;
            .txt2 &#xC120;&#xBD88;
            .txt3 &#xCE74;&#xB4DC;+&#xD604;&#xAE08;
            .date 2021-02-10 11:13:20
            .btn_orderList &#xC8FC;&#xBB38;&#xB0B4;&#xC5ED;
  .right_wrap
    p#clock {{ getNowDate() }}
    .branch
      svg(xmlns='http://www.w3.org/2000/svg' width='45.364' height='20.959' viewbox='0 0 45.364 20.959')
        g(transform='translate(-897 -972)')
          path(d='M915.35,981.175a9.175,9.175,0,1,0-10.014,9.137v2.134a.512.512,0,0,0,.512.512.507.507,0,0,0,.142-.02,15.23,15.23,0,0,0,4.628-2.463,11.559,11.559,0,0,0,4.429-6.96A9.193,9.193,0,0,0,915.35,981.175Z' fill='#fc0000')
          g(transform='translate(900.788 974.545)')
            path(d='M930.149,1000.26a1.762,1.762,0,0,1-1.76-1.76v-6.27c0-.029,0-.057,0-.086a3.426,3.426,0,0,0,.033-.472v-1.192a1.115,1.115,0,0,0-2.231,0v1.192a1.166,1.166,0,0,1-1.164,1.164H923.96a1.116,1.116,0,0,0,0,2.231h1.062a3.38,3.38,0,0,0,1.135-.2V998.5a4,4,0,0,0,3.991,3.991,1.115,1.115,0,0,0,0-2.231Z' transform='translate(-922.845 -989.364)' fill='#fff')
            circle(cx='1.116' cy='1.116' r='1.116' transform='translate(6.304 3.472)' fill='#fff')
          g(transform='translate(919.456 975.974)')
            g(transform='translate(0 0)')
              path(d='M1128.014,1002.274a1.093,1.093,0,0,0,0-2.186h-5.156a1.093,1.093,0,0,0-1.093,1.093v5.777a1.093,1.093,0,0,0,1.093,1.093h5.156a1.093,1.093,0,0,0,0-2.187h-4.063v-3.591Z' transform='translate(-1111.279 -999.946)' fill='#fff')
              path(d='M1058.417,1009.589h-2.783v-2.039a4.291,4.291,0,1,0-2.186.017v3.115a1.093,1.093,0,0,0,1.093,1.093h3.876a1.093,1.093,0,0,0,0-2.187Zm-6.013-6.18a2.106,2.106,0,1,1,2.106,2.106A2.108,2.108,0,0,1,1052.4,1003.409Z' transform='translate(-1050.218 -999.117)' fill='#fff')
              path(d='M1173.883,1020.346h-3.23a1.093,1.093,0,1,0,0,2.186h2.137v2.932a1.093,1.093,0,0,0,2.186,0v-4.025A1.093,1.093,0,0,0,1173.883,1020.346Z' transform='translate(-1152.069 -1017.235)' fill='#fff')
      p {{storeName}}

    ul.menu
      li
        a(@click="restart()")
          svg(xmlns='http://www.w3.org/2000/svg' width='19.414' height='15.747' viewbox='0 0 19.414 15.747')
            g(transform='translate(-0.293 -2.478)')
              path(d='M21.909,4V8.909H17' transform='translate(-2.909 -0.182)' fill='none' stroke='#fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1')
              path(d='M1,18.909V14H5.909' transform='translate(0 -2)' fill='none' stroke='#fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1')
              path(d='M3.054,7.909A7.364,7.364,0,0,1,15.2,5.16L19,8.727M1,12l3.8,3.567a7.364,7.364,0,0,0,12.15-2.749' transform='translate(0 0)' fill='none' stroke='#fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1')
          | 새로고침
      li
        router-link(v-if="visibleOrderButton" :to="paths.order")
          svg(xmlns='http://www.w3.org/2000/svg' width='19' height='21' viewbox='0 0 19 21')
            g(transform='translate(-3.5 -1.5)')
              path(d='M17.5,4h2.25A2.135,2.135,0,0,1,22,6V20a2.135,2.135,0,0,1-2.25,2H6.25A2.135,2.135,0,0,1,4,20V6A2.135,2.135,0,0,1,6.25,4H8.5' fill='none' stroke='#fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1')
              rect(width='8' height='4' rx='1' transform='translate(9 2)' fill='none' stroke='#fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1')
          | 주문보기
      li
        router-link(v-if="visibleOrderButton" :to="paths.additional")
          svg(xmlns='http://www.w3.org/2000/svg' width='19' height='19' viewbox='0 0 19 19')
            g(transform='translate(-0.5 -0.5)')
              circle(cx='2' cy='2' r='2' transform='translate(8 8)' fill='none' stroke='#fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1')
              path(d='M16.055,12.455a1.35,1.35,0,0,0,.27,1.489l.049.049a1.637,1.637,0,0,1,0,2.314l0,0a1.637,1.637,0,0,1-2.314,0l0,0-.049-.049a1.361,1.361,0,0,0-2.307.965v.139a1.636,1.636,0,1,1-3.273,0V17.29a1.35,1.35,0,0,0-.884-1.235,1.35,1.35,0,0,0-1.489.27l-.049.049a1.637,1.637,0,0,1-2.314,0l0,0a1.637,1.637,0,0,1,0-2.314l0,0,.049-.049A1.361,1.361,0,0,0,2.775,11.7H2.636a1.636,1.636,0,1,1,0-3.273H2.71a1.35,1.35,0,0,0,1.235-.884,1.35,1.35,0,0,0-.27-1.489l-.049-.049a1.637,1.637,0,0,1,0-2.314l0,0a1.637,1.637,0,0,1,2.314,0l0,0,.049.049a1.35,1.35,0,0,0,1.489.27h.065a1.351,1.351,0,0,0,.818-1.235V2.636a1.636,1.636,0,1,1,3.273,0V2.71a1.361,1.361,0,0,0,2.307.965l.049-.049a1.637,1.637,0,0,1,2.314,0l0,0a1.637,1.637,0,0,1,0,2.314l0,0-.049.049a1.35,1.35,0,0,0-.27,1.489v.065a1.351,1.351,0,0,0,1.235.818h.139a1.636,1.636,0,1,1,0,3.273H17.29A1.351,1.351,0,0,0,16.055,12.455Z' fill='none' stroke='#fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1')
          | 추가기능(테스트)
      li
        router-link(v-if="visibleOrderButton" :to="paths.paymentManagement")
          svg(xmlns='http://www.w3.org/2000/svg' width='19' height='21' viewbox='0 0 19 21')
            g(transform='translate(-3.5 -1.5)')
              path(d='M15.25,2h-9A2.135,2.135,0,0,0,4,4V20a2.135,2.135,0,0,0,2.25,2h13.5A2.135,2.135,0,0,0,22,20V8Z' fill='none' stroke='#fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1')
              path(d='M14,2V8h6' transform='translate(2)' fill='none' stroke='#fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1')
              line(x1='8' transform='translate(9 13)' fill='none' stroke='#fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1')
              line(x1='8' transform='translate(9 17)' fill='none' stroke='#fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1')
              path(d='M10,9H8' transform='translate(0.571)' fill='none' stroke='#fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1')
          | 결제내역
    .view_setting
      p 테블릿 화면
      label.switch(v-on:click.stop="toggleTabletScreen")
        input(type='checkbox' v-bind:checked="statusTabletScreen" disabled="disabled" )
        span.slider.round
      p 테블릿 주문
      label.switch(v-on:click.stop="toggleOrder")
        input(type='checkbox' v-bind:checked="statusOrder" disabled="disabled")
        span.slider.round
      p 주문내역
      label.switch(v-on:click.stop="toggleRecentOrder")
        input(type='checkbox' v-bind:checked="statusRecentOrder" disabled="disabled")
        span.slider.round
    .btm
      p.txt
        | {{storeName}}
        br
        | {{version}}
      a.btn_logout(v-if="visibleLogoutButton" @click="logout") 로그아웃

//#orderview
  //- transition(name="signboard")
  //-   .top(v-if="isDisConnectNetwork")
  //-     .alert {{ signboardMessage }}
  .body
    .left
      router-view(
        :auth="auth"
        :orders="orders"
        :stores="stores"
        :time="time"
      )
    .right(v-if="visibleSideMenu()")
      .top
        .button(
          @click="restart()"
        ) 새로고침
        .datetime
          span {{ getNowDate() }}
        torder
        .store_name {{storeName}}
        router-link.button(v-if="visibleOrderButton" :to="paths.order") 주문 보기
        router-link.button(v-if="visibleOrderButton" :to="paths.additional") 추가 기능
          <br> (테스트)
        router-link.button(v-if="visibleOrderButton" :to="paths.paymentManagement") 결제 내역

        //- router-link.button(v-if="visibleOrderButton" :to="paths.products") 상품 관리
        //-   <br> (테스트)
        //- router-link.button(v-if="visibleOrderButton" :to="paths.tables") 테이블 주문
        //-   <br> (테스트)
        //- router-link.button(v-if="visibleOrderButton" :to="paths.pickUpTables") 픽업 요청
        //-   <br> (테스트)
      //-   router-link.button(v-if="visibleOrderButton" :to="paths.updateCategories") 분류 관리
      //-     <br> (테스트)
      .bottom
        hr
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
        .tab-group
          .tab-name 주방 마감
          .tab-buttons
            .tab-button(:class="getOnKitchenOrderClass(device)" @click="showKitchenOrder") On
            .tab-button(:class="getOffKitchenOrderClass(device)" @click="hideKitchenOrder") Off
        hr
        router-link.button(v-if="visibleStoresButton" :to="paths.store") 매장 보기
        router-link.button.button-red(v-if="visibleLoginButton" :to="paths.login") 로그인
        .name {{userName}}
        .version {{version}}
        .button.button-red.button-member(v-if="visibleLogoutButton" @click="logout")
          span 로그아웃
  .foot.foot-right
    .version-footer u-code: {{uCode}} {{version}}
</template>

<script>
import store from '@store/store';
import paths from '@router/paths';
import { version } from '@utils/constants';
import { Torder } from '@svg';
import { AlertModal } from '@components';
import axios from 'axios';
import endpoints from '@store/endpoints';

export default {
  components: {
    Torder,
    'alert-modal': AlertModal,
  },
  store,
  data() {
    return {
      orders: [],
      time: {
        now: 0,
        start: 0,
        end: 0,
      },
      paths,
      logo: 'https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/logo/torder_color_white.png',
      version,
    };
  },
  computed: {
    isAlertModal() {
      return this.$store.state.isAlertModal;
    },
    requestCashItem() {
      return this.$store.state.requestCashItem;
    },
    statusTabletScreen() {
      const result = this.$store.state.device.serviceStatus;
      return !result;
    },
    statusOrder() {
      const result = this.$store.state.device.orderStatus;
      return !result;
    },
    statusRecentOrder() {
      const result = this.$store.state.device.recentOrderStatus;
      return !result;
    },
    confirmModal() {
      return this.$store.state.confirmModal;
    },
    uCode() {
      return this.$store.state.uCode;
    },
    order() {
      return !!this.$store.state.order;
    },
    stores() {
      const { stores } = this.$store.state;
      return stores.sort((a, b) => a.name - b.name);
    },
    device() {
      return this.$store.state.device;
    },
    auth() {
      return this.$store.state.auth;
    },
    storeName() {
      const { auth } = this;
      return auth && auth.store && auth.store.store_name;
    },
    visibleOrderButton() {
      const { auth } = this;
      return !!(auth && auth.store && auth.store.store_code);
    },
    visibleStoresButton() {
      const { stores } = this;
      return stores.length > 1;
    },
    userName() {
      const { auth } = this;
      return auth && auth.member && auth.member.name;
    },
    visibleLoginButton() {
      return !this.userName;
    },
    visibleLogoutButton() {
      return !!this.userName;
    },
    visibleAllRefreshModal() {
      return this.$store.state.visibleAllRefreshModal;
    },
    allRefreshList() {
      return this.$store.state.allRefreshList;
    },
    isDisConnectNetwork() {
      return this.$store.state.isDisConnectNetwork;
    },
    signboardMessage() {
      return this.$store.state.signboardMessage;
    },
  },
  watch: {
    '$route'(to, from) {
      this.$socket.emit('log', {
        path: to.path,
        from: from.path,
      });
    },
  },
  beforeCreate() {
    let MACAddr = '';
    try {
      if (window.UUID) {
        MACAddr = window.UUID.getMacAddress();
      }
    } catch(e) {
      // console.log(e);
    }

    this.$store.commit('updateMACAddr', MACAddr);
  },
  created() {
    this.getAuthentication();
    this.observableRefresh();
  },
  mounted() {
    this.watchPayment();
    this.catchOffline();
    this.catchOnline();
    this.getUCode();
    this.loopBeep();
    if (process.env.UPLOAD_TYPE !== 'tmp') {
      this.tagetVersionRedirect();
    }
    this.initialized();
  },
  sockets: {
    connect() {
      // console.log('socket connected');
      this.beep();
    },
    orderview(message) {
      this.$socket.emit('res', message, () => {
        // console.log('socket res');
      });
    },
  },
  methods: {
    async commit(item, url) {
      console.log('commit', item);
      let data = new FormData();
      data.append('key', item.key);
      data.append('id', item.id);
      data.append('stat', item.creditStat);
      data.append('type',  item.creditType);
      data.append('storeCode', item.storeCode);
      data.append('tabletNumber', item.tabletnumber);
      data.append('tablename', item.tableName);
      data.append('orderKey', item.orderkey);
      const res =  await axios({
        method: 'post',
        url,
        data: data,
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log('commit res', res);
      return res;
    },
    showAlert(message) {
      this.$store.commit('updateAlertModalMessage', message);
      return this.$store.commit('updateIsAlertModal', true);
    },
    watchPayment() {
      window.addEventListener('message', async (event) => {
        try {
          const msg = event?.data;
          const methodName = msg?.methodName;

          if (methodName === 'callBackPayment') {
            // console.log(event);

            if (msg?.result) {
              const vanData = JSON.parse(msg.result);

              // acquirer: "삼성카드사"
              // acquirerCode: "04"
              // amount: "000000002000"
              // approvalDate: "20210311174931"
              // approvalMonth: "00"
              // approvalNumber: "36204121"
              // approvalType: "REFUND"
              // cardNumber: "536148**********"
              // deviceId: "DPT0TEST03"
              // errorMessage: ""
              // issuer: "삼성마스터카드"
              // issuerCode: "04"
              // orderKey: "TEST_TPAY_003-TEST_TPAY_003_TEST-1615452524"
              // payReqId: "TEST_TPAY_003-TEST_TPAY_003_TEST-1615452521-4x6mn"
              // paymentCompany: "KSNET"
              // paymentDate: "20210311174934"
              // paymentId: "687743457830"
              // paymentResultUpload: "N"
              // receiptType: ""
              // responseCode: "0000"
              // resultText: "success"
              // storeCode: "TEST_TPAY_003"
              // tableNo: "TEST_TPAY_003_TEST"
              // vat: "000000000000"

              if (vanData?.responseCode === "0000") {
                // 결제 취소 페이지 고고링
                console.log('결제 취소 완료', vanData);

                const requestCreditItem = this.$store?.state?.requestCreditItem;

                if (!requestCreditItem?.key) {
                  return this.showAlert(`key 값이 없습니다 아닙니다. 에러메세지: ${requestCreditItem?.key}`);
                }

                if (!requestCreditItem?.id) {
                  return this.showAlert(`id 값이 없습니다 아닙니다. 에러메세지: ${requestCreditItem?.id}`);
                }

                if (!requestCreditItem?.creditStat) {
                  return this.showAlert(`stat 값이 없습니다 아닙니다. 에러메세지: ${requestCreditItem?.creditStat}`);
                }

                if (!requestCreditItem?.creditType) {
                  return this.showAlert(`type 값이 없습니다 아닙니다. 에러메세지: ${requestCreditItem?.creditType}`);
                }

                if (!requestCreditItem?.storeCode) {
                  return this.showAlert(`storeCode 값이 없습니다 아닙니다. 에러메세지: ${requestCreditItem?.storeCode}`);
                }

                if (!requestCreditItem?.tabletnumber) {
                  return this.showAlert(`tabletnumber 값이 없습니다 아닙니다. 에러메세지: ${requestCreditItem?.tabletnumber}`);
                }

                if (!requestCreditItem?.tableName) {
                  return this.showAlert(`tableName 값이 없습니다 아닙니다. 에러메세지: ${requestCreditItem?.tableName}`);
                }

                if (!requestCreditItem?.orderkey) {
                  return this.showAlert(`orderkey 값이 없습니다 아닙니다. 에러메세지: ${requestCreditItem?.orderkey}`);
                }

                const url = endpoints.payment.cardCancelCommit;
                const res = await this.commit(requestCreditItem, url);

                if (res.status === 200) {
                  const newItem = res?.data?.rowData;

                  if (!res.data) {
                    return this.showAlert(`API cardCancelCommit 응답값 data이 없습니다 아닙니다. 응답값: ${newItem}`);
                  }

                  if (res?.data?.length === 0) {
                    return this.showAlert(`API cardCancelCommit 응답값 data크기가 0입니다. 아닙니다. 응답값: ${res.data}`);
                  }

                  if (!newItem) {
                    return this.showAlert(`API cardCancelCommit 응답값 rowData이 없습니다 아닙니다. 응답값: ${newItem}`);
                  }

                  // newItem {id: ''}

                  this.$store.commit('replacePaymentListItem', newItem);
                  return this.$store.commit('updateItemModal', {
                    currName: null,
                    index: null,
                  });
                }

                return this.showAlert(`잘못된 response status 200이 아닙니다. status: ${res?.status}`);
              } else {
                return this.showAlert(`잘못된 responseCode 0000이 아닙니다. 에러메세지: ${vanData?.errorMessage}`);
              }
            } else {
              return this.showAlert(`잘못된 callBackPayment message 형태입니다. 출력값: ${msg?.result}`);
            }
          }

        } catch (error) {
          return this.showAlert(`${event?.data?.methodName} 잘못된 message 형태입니다. 에러: ${error.message}`);
        }
      });
    },
    async requestPaymentCommit(item, url) {
      console.log({item});
      let data = new FormData();
      data.append('key', item.key);
      data.append('id', item.id);
      data.append('stat', item.creditStat);
      data.append('type',  item.creditType);
      data.append('storeCode', item.storeCode);
      data.append('tabletNumber', item.tabletnumber);
      data.append('tablename', item.tableName);
      data.append('orderKey', item.orderkey);
      return  await axios({
        method: 'post',
        url,
        data: data,
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    closeRequestItemModal() {
      this.$store.commit("clearRequestCashItem");
    },
    async cashCommit(item) {
      const url = endpoints.payment.cashCommit;
      const res  = await this.requestPaymentCommit(item, url);

      console.log({res});

      const newItem = res.data.rowData;
      // this.replaceItem(newItem);

      this.$store.commit('UPDATE_ORDER_CREDIT', newItem, true);
      this.$store.commit('clearRequestCashItem');
    },
    toggleTabletScreen() {
      if (this.statusTabletScreen) {
        this.closeTabletScreen();
      } else {
        this.openTabletScreen();
      }
    },
    toggleOrder() {
      if (!this.statusOrder) {
        this.agreeOrder();
      } else {
        this.rejectOrder();
      }
    },
    toggleRecentOrder() {
      if (!this.statusRecentOrder) {
        this.showRecentOrder();
      } else {
        this.hideRecentOrder();
      }
    },
    catchOffline() {
      window.addEventListener('offline', () => {
        // console.log("you're offline");
        const payload = {
          visible: true,
          message: '인터넷이 연결 되지 않았습니다. 인터넷 연결 확인 후 새로고침 해주세요.',
        };

        this.$store.commit('setSignBoardStatus', payload);
      });
    },
    catchOnline() {
      window.addEventListener('online', () => {
        // console.log("you're online");
        const payload = {
          visible: false,
          message: '',
        };

        this.$store.commit('setSignBoardStatus', payload);
      });
    },
    observableRefresh() {
      // close web tab
      window.addEventListener('beforeunload', () => {
        // console.log('beforeunload', this.$route?.params?.id);
        if (this.$route?.params?.id) {
          const { store_code } = this.$store.state.auth.store;
          const payload = {
            store: {
              code: store_code,
            },
            type: '@request/ordering/location/table',
            tableId: this.$route.params.id,
            uCode: this.$store.state.uCode,
            MACAddr: this.$store.state.MACAddr,
            ordering: false,
          };

          this.$socket.emit('orderview', payload);
        }
      // event.returnValue = 'Write something';
      });
    },
    async initialized() {
      try {
        const params = { shop_code: this.$store.state.auth.store.store_code };
        const tables = await this.$store.dispatch('setTables', params);

        tables.forEach((table) => {
          this.$socket.emit('event', {
            store: {
              code: this.$store.state.auth.store.store_code,
            },
            table: {
              code: table.Ta_id,
            },
            type: 'getSuspendSale',
          });
        });

      } catch (error) {
        // console.log(error);
      }
    },
    async tagetVersionRedirect() {
      try {
        if (this.$store.state.auth?.store?.store_code) {
          const params = new FormData();
          params.append('store_code', this.$store.state.auth.store.store_code);
          const res = await this.$store.dispatch('setStoreInit', params);
          // // console.log('tagetVersionRedirect', res);

          const nextUrl = res.data.data.T_order_store_orderView_version;
          if (nextUrl) {
            const {
              protocol,
              hostname,
              pathname,
            } = location;

            const nowPath = `${protocol}//${hostname}${pathname}#/`;
            // console.log('location', nowPath, nextUrl);

            if (!process.env.STOP_REDIRECT) {
              if (nowPath !== nextUrl) {
                return location.replace(nextUrl);
              }
            }
          }
          return false;
        }
      } catch (error) {
        return false;
      }
    },
    visibleSideMenu() {
      const targetPath = this.$router.history.current.path;

      const isLoginPath = targetPath === '/login';
      const isStorePath = targetPath === '/store';

      const isFalse = isLoginPath || isStorePath;

      if (isFalse) return false;

      return true;
    },
    logout() {
      this.$store.dispatch('logout');

      localStorage.removeItem('auth');
      this.$router.replace(paths.login);
    },
    restart() {
      // location.href = '/'; // cache 파일을 먼저 로드한다.
      location.replace('/'); // cache 파일을 로드하지 않는다.
    },
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
        const value = 0;
        const { disconnected } = this.emitServiceStatus(value);

        if (disconnected) {
          this.$store.commit('setDeviceServiceStatus', value);
          this.$store.commit('pushFlashMessage', '태블릿 화면 열기 상태로 변경 되었습니다.');
        }

        this.closeConfirmModal();
      }
    },
    async reqCloseTablet() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.store_code);

      const response = await this.$store.dispatch('setCloseTablet', fd);

      if (response) {
        const value = 1;
        const { disconnected } = this.emitServiceStatus(value);

        if (disconnected) {
          this.$store.commit('setDeviceServiceStatus', value);
          this.$store.commit('pushFlashMessage', '태블릿 화면 닫기 상태로 변경 되었습니다.');
        }

        this.closeConfirmModal();
      }
    },
    async reqAgreeOrder() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.store_code);
      const response = await this.$store.dispatch('setAgreeOrder', fd);

      if (response) {
        const value = 0;
        const { disconnected } = this.emitAgreeOrder(value);

        if (disconnected) {
          this.$store.commit('setDeviceOrderStatus', value);
          this.$store.commit('pushFlashMessage', '태블릿 주문 받기 상태로 변경 되었습니다.');
        }

        this.closeConfirmModal();
      }
    },
    async reqRejectOrder() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.store_code);
      const response = await this.$store.dispatch('setRejectOrder', fd);

      if (response) {
        const value = 1;
        const { disconnected } = this.emitAgreeOrder(value);

        if (disconnected) {
          this.$store.commit('setDeviceOrderStatus', value);
          this.$store.commit('pushFlashMessage', '태블릿 주문 중단 상태로 변경 되었습니다.');
        }

        this.closeConfirmModal();
      }
    },
    async reqShowOrder() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.store_code);
      const response = await this.$store.dispatch('setShowRecentOrder', fd);

      if (response) {
        const value = 0;
        const { disconnected } = this.emitRecentOrder(value);

        if (disconnected) {
          this.$store.commit('setDeviceRecentOrderStatus', value);
          this.$store.commit('pushFlashMessage', '태블릿 주문 내역 표시 상태로 변경 되었습니다.');
        }

        this.closeConfirmModal();
      }
    },
    async reqHideOrder() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.store_code);
      const response = await this.$store.dispatch('setCloseRecentOrder', fd);

      if (response) {
        const value = 1;
        const { disconnected } = this.emitRecentOrder(value);

        if (disconnected) {
          this.$store.commit('setDeviceRecentOrderStatus', value);
          this.$store.commit('pushFlashMessage', '태블릿 주문 내역 숨김 상태로 변경 되었습니다.');
        }

        this.closeConfirmModal();
      }
    },
    emitServiceStatus(value) {
      const { store_code } = this.$store.state.auth.store;
      const payload = {
        store: {
          code: store_code,
        },
        type: '@update/device/serviceStatus',
        value,
      };
      return this.$socket.emit('orderview', payload);
    },
    emitAgreeOrder(value) {
      const { store_code } = this.$store.state.auth.store;
      const payload = {
        store: {
          code: store_code,
        },
        type: '@update/device/agreeOrder',
        value,
      };
      return this.$socket.emit('orderview', payload);
    },
    emitRecentOrder(value) {
      const { store_code } = this.$store.state.auth.store;
      const payload = {
        store: {
          code: store_code,
        },
        type: '@update/device/recentOrder',
        value,
      };
      return this.$socket.emit('orderview', payload);
    },
    getOnTabletMonitorClass(device) {
      const active = !this.validServiceStatus(device);

      return {
        active,
      };
    },
    getOffTabletMonitorClass(device) {
      const active = this.validServiceStatus(device);

      return {
        active,
      };
    },
    validServiceStatus(device) {
      return device && device.serviceStatus;
    },
    getOnTabletOrderClass(device) {
      const active = !this.validOrderStatus(device);

      return {
        active,
      };
    },
    getOffTabletOrderClass(device) {
      const active = this.validOrderStatus(device);

      return {
        active,
      };
    },
    validOrderStatus(device) {
      return device && device.orderStatus;
    },
    beep() {
      const time = Date.now();
      const ISONow = new Date(time).toISOString();
      const datetime = this.$moment(ISONow).format();

      let deviceUsage = {};
      try {
        if (window.UUID) {
          deviceUsage = JSON.parse(window.UUID.getDeviceUsage());
        }
      } catch(e) {
        //// console.log(e);
      }

      const data = {
        type: 'beep',
        uCode: this.$store.state.uCode,
        MACAddr: this.$store.state.MACAddr,
        deviceUsage: deviceUsage,
        location: window.location,
        store: {
          code: this.$store.state.auth?.store?.code,
        },
        time: time,
        path: this.$route.path,
        datetime: datetime,
      };

      this.$socket.emit('event', data, () => {
        // // console.log('event', answer.msg);
      });
    },
    getAuthentication() {
      try {
        const params = { store_code: this.auth.store.store_code };

        const auth = JSON.parse(localStorage.auth);
        console.log('getAuthentication', auth);

        this.$socket.emit('reqStoreInfo', params);
        this.$store.commit('SET_AUTH', auth);
      } catch (error) {
        // console.log(error);
      }
    },
    getUCode() {
      // get uCode from localStorage
      let uCode = localStorage.getItem('uCode');

      // create uCode if no code
      if (!uCode) {
        uCode = '';
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < 5; i++ ) {
          uCode += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        // set uCode to localStorage
        localStorage.setItem('uCode', uCode);
      }
      this.$store.commit('updateUCode', uCode);
    },
    loopBeep() {
      this.beep();
      setInterval(() => {
        this.time.now = parseInt(Date.now());

        const timestemp = parseInt(Date.now() / 1000);
        const lap = timestemp % 30;
        const term = lap < 1;

        if (term) {
          // console.log('term', new Date());
          this.beep();
        }
      }, 1000);
    },
    onCloseAllRefreshModal() {
      this.$store.commit('CLOSE_ALL_REFRESH_MODAL');
      this.$store.commit('SET_ALL_REFRESH_LIST', []);
    },
    getOnTabletRecentOrderClass(device) {
      const active = !this.validRecentOrderStatus(device);

      return {
        active,
      };
    },
    getOffTabletRecentOrderClass(device) {
      const active = this.validRecentOrderStatus(device);

      return {
        active,
      };
    },
    validRecentOrderStatus(device) {
      return device && device.recentOrderStatus;
    },
    getNowDate() {
      if (!this.time.now) {
        return '';
      }
      const now = new Date(this.time.now);
      const ISONow = now.toISOString();

      return this.$moment(ISONow).format('MM.DD HH:mm:ss');
    },
    showKitchenOrder() {
      if (!this.$store.state.device.kitchenOrderStatus) {
        return this.$store.commit('pushFlashMessage', '이미 주문 내역 표시 상태로 되어있습니다.');
      }
      const confirmModal = {};

      confirmModal.show = true;
      confirmModal.close = this.closeConfirmModal;
      confirmModal.title = '주방 마감 메뉴 표시';
      confirmModal.message = '태블릿에서 주방 마감 메뉴가 나타납니다';
      confirmModal.confirm = this.reqShowKitchenOrder;

      this.$store.commit('showConfirmModal', confirmModal);
    },
    hideKitchenOrder() {
      if (this.$store.state.device.kitchenOrderStatus) {
        return this.$store.commit('pushFlashMessage', '이미 주문 내역 표시 상태로 되어있습니다.');
      }
      const confirmModal = {};

      confirmModal.show = true;
      confirmModal.close = this.closeConfirmModal;
      confirmModal.title = '주방 마감 메뉴 표시';
      confirmModal.message = '태블릿에서 주방 마감 메뉴가 사라집니다.';
      confirmModal.confirm = this.reqHideKitchenOrder;

      this.$store.commit('showConfirmModal', confirmModal);
    },
    emitKitchenOrder(value) {
      const { store_code } = this.$store.state.auth.store;
      const payload = {
        store: {
          code: store_code,
        },
        type: '@update/device/kitchenOrder',
        value,
      };
      return this.$socket.emit('orderview', payload);
    },
    async reqShowKitchenOrder() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.store_code);
      const response = await this.$store.dispatch('setShowKitchenOrder', fd);

      if (response) {
        const value = 0;
        const { disconnected } = this.emitKitchenOrder(value);

        if (disconnected) {
          this.$store.commit('setDeviceKitchenOrderStatus', value);
          this.$store.commit('pushFlashMessage', '태블릿 주문 내역 표시 상태로 변경 되었습니다.');
        }

        this.closeConfirmModal();
      }
    },
    async reqHideKitchenOrder() {
      const fd = new FormData();
      fd.append('store_code', this.auth.store.store_code);
      const response = await this.$store.dispatch('setCloseKitchenOrder', fd);

      if (response) {
        const value = 1;
        const { disconnected } = this.emitKitchenOrder(value);

        if (disconnected) {
          this.$store.commit('setDeviceKitchenOrderStatus', value);
          this.$store.commit('pushFlashMessage', '태블릿 주문 내역 표시 상태로 변경 되었습니다.');
        }

        this.closeConfirmModal();
      }
    },
    getOnKitchenOrderClass() {
      const active = !this.device?.kitchenOrderStatus;

      return {
        active,
      };
    },
    getOffKitchenOrderClass() {
      const active = this.device?.kitchenOrderStatus;

      return {
        active,
      };
    },
  },
};
</script>

<style lang="scss">
@import "../../scss/common.css";
@import "../../scss/style.scss";
@import "../../scss/global.scss";
#orderview-old {
  display:flex;
  flex-direction:column;
  width: 100vw;
  height: 100vh;
  position:relative;
  background-color:#000000;
  font-family: 'NanumSquare', sans-serif;
}
#orderview-old > .top {
  display: flex;
  flex-direction: row;
  .alert {
    background-color: #ff0000;
    font-size: 28px;
    padding: 12px;
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
  }
}
#orderview-old > .body {
  display:flex;
  flex-grow:1;
  overflow:scroll;

  .right {
    width:120px;
    flex-shrink:0;
    flex-direction:column;
    display:flex;
    padding:12px;
    overflow:auto;
    background-color:#121212;

    hr {
      border-color:#606060;
    }

    .name {
      font-size:12px;
      text-align: center;
      margin-bottom: 4px;
    }

    .button {
      display:flex;
      align-items: center;
      justify-content: center;
      margin-top: 8px;
      margin-bottom: 4px;
      height: 40px;
      width: 100%;
      border-radius: 100px;
      background-color: #ffffff;
      color: #000000;
      font-weight: 900;
      text-decoration: none;
      text-align: center;
    }
    .button.active {
      background-color:#484848;
      color:#eaeaea;
    }
    .button-member {
      flex-direction:column;
    }
    .button-red {
      background-color:#ff0000;
      color:#ffffff;
    }
    .top {
      display:flex;
      flex-direction:column;
      align-items: center;
      justify-content: flex-start;
      flex-grow:1;
      .logo {
        height:40px;
        margin-bottom:12px;
        max-width:160px;
      }
      .button{
        margin-top:0!important;
        margin-bottom:12px;
      }
      .store_name {
        margin-bottom:12px;
        font-size:12px;
        font-weight:900;
        word-break:keep-all;
        text-align:center;
      }
      .datetime {
        margin-bottom:12px;
        display:flex;
        flex-direction:column;
        align-items: center;
        justify-content: center;
        width:100%;
        height:40px;
        border-radius:100px;
        background-color:#484848;
        font-weight:400;

        .price {
          font-size:12px;
          font-weight:900;
        }
      }
    }
    .bottom{
      justify-content: flex-end;

      .buttons {
        display:flex;
      }
    }
    .version {
      text-align: center;
    }

    @include tab-group;

    .tab-group {
      flex-direction:column;
      margin-top:0px;
      flex-grow:0;
      .tab-name {
        display:flex;
        height:40px;
        padding:0 24px;
        font-size:12px;
        font-weight:900;
        border-radius:200px;
        background-color:#121212;
        color:#ffffff;
        align-items: center;
        justify-content: center;
        text-decoration:none;
      }
    }
    > .button {
      display:flex;
      margin-top:40px;
      height:40px;
      padding:0 24px;
      font-size:16px;
      font-weight:900;
      border-radius:200px;
      background-color:#eaeaea;
      color:#000000;
      align-items: center;
      justify-content: center;
      text-decoration:none;
      box-shadow: 0px 0px 12px -4px #000000;
    }

  }
  .left {
    flex-grow:1;
    display:flex;
    overflow:auto;
    .container {
      display:flex;
      flex-direction:column;
      padding:12px;
      flex-grow:1;

      > * {
        display:flex;
      }
      > .top {

        display:flex;
        align-items: center;
        justify-content: center;
        border-bottom:solid 1px #ffffff;
        padding-bottom:12px;
        .title {
          display:flex;
          align-items: center;
          justify-content: center;
          font-size:24px;
          font-weight:900;
        }
      }
      > .bottom {
        margin-top:24px;

        .button {
          display:flex;
          margin:0;
          flex-grow:1;
          align-items: center;
          justify-content: center;
          height:60px;
          background-color:#ff0000;
          color:#ffffff;
          border-radius:100px;
          font-size:20px;
          font-weight:900;
        }
      }
    }
  }
}
#orderview-old {
  > .foot-left {
    display:flex;
    position:absolute;
    bottom:0;
    left:0;
  }
  > .foot-right {
    display:flex;
    position:fixed;
    bottom:0;
    right: 4px;
    .version-footer {
      font-size: 8px;
    }
  }
  > .foot {
    .button {
      display:flex;
      margin: 12px 6px;
      height:40px;
      padding:0 24px;
      font-size:16px;
      font-weight:900;
      border-radius:200px;
      background-color:#eaeaea;
      color:#000000;
      align-items: center;
      justify-content: center;
      text-decoration:none;
      box-shadow: 0px 0px 12px -4px #000000;
    }
  }
}

@keyframes mdHead {
  0% {
    transform: translateY(-100vh);
  }
  100% {
    transform: translateY(0);
  }
}

.signboard-enter-active {
  animation: mdHead .5s;
}

.signboard-leave-active {
  animation: mdHead .5s reverse;
}
</style>
