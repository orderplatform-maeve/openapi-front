<template lang="pug">
  .right_wrap
    p#clock {{ getNowDate() }}
    .branch
      svg(xmlns='http://www.w3.org/2000/svg' width='4.3984375vw' height='1.637421875vw' viewbox='0 0 45.364 20.959')
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
      p 태블릿 화면
      label.switch(v-on:click.stop="toggleTabletScreen")
        input(type='checkbox' v-bind:checked="statusTabletScreen" disabled="disabled" )
        span.slider.round
      p 태블릿 주문
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
</template>

<script>
import { version } from '@utils/constants';
import paths from '@router/paths';

export default {
  data() {
    return {
      time: {
        now: 0,
        start: 0,
        end: 0,
      },
      version,
      paths,
      deviceUsage: {},
    };
  },
  methods: {
    restart() {
      // location.href = '/'; // cache 파일을 먼저 로드한다.
      location.replace('/'); // cache 파일을 로드하지 않는다.
    },
    getNowDate() {
      if (!this.time.now) {
        return '';
      }
      const now = new Date(this.time.now);
      const ISONow = now.toISOString();

      return this.$moment(ISONow).format('MM.DD HH:mm:ss');
    },
    beep() {
      const time = Date.now();
      const ISONow = new Date(time).toISOString();
      const datetime = this.$moment(ISONow).format();

      try {
        window.UUID?.getDeviceUsage();
      } catch(e) {
        //// console.log(e);
      }

      const data = {
        type: 'beep',
        uCode: this.$store.state.uCode,
        MACAddr: this.$store.state.MACAddr,
        deviceUsage: this.deviceUsage,
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
    loopBeep() {
      this.beep();
      setInterval(() => {
        this.time.now = parseInt(Date.now());

        const timestemp = parseInt(Date.now() / 1000);
        const lap = timestemp % 30;
        const term = lap < 1;

        if (term) {
          console.log('term', new Date());
          this.beep();
        }
      }, 1000);
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
  },
  mounted() {
    this.loopBeep();
  },
  computed: {
    statusOrder() {
      const result = this.$store.state.device.orderStatus;
      return !result;
    },
    statusRecentOrder() {
      const result = this.$store.state.device.recentOrderStatus;
      return !result;
    },
    visibleLogoutButton() {
      return !!this.userName;
    },
    visibleOrderButton() {
      const { auth } = this;
      return !!(auth && auth.store && auth.store.store_code);
    },
    storeName() {
      const { auth } = this;
      return auth && auth.store && auth.store.store_name;
    },
    statusTabletScreen() {
      const result = this.$store.state.device.serviceStatus;
      return !result;
    },
    auth() {
      return this.$store.state.auth;
    },
  }
};
</script>

<style lang="scss" scoped>

</style>
