<template lang="pug">
 .right
  .top
    .button(v-on:click="restart('/')") 새로고침
    .datetime
      span {{time.now | moment("MM.DD HH:mm") }}
    img.logo(src="https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/logo/torder_color_white.png")
    .store_name(v-on:click="removeAuth") {{store.name}}
    router-link.button(v-if="store.code" to="/order") 주문 보기
    router-link.button(v-if="store.code" to="/table") 테이블 보기<br/>(테스트)

  .bottom
    hr
    .tab-group
      .tab-name 태블릿 화면
      .tab-buttons
        .tab-button(:class="{active:!store.serviceStatus}" v-on:click="setServiceStatus(0)") On
        .tab-button(:class="{active:store.serviceStatus}" v-on:click="setServiceStatus(1)") Off
    .tab-group
      .tab-name 태블릿 주문
      .tab-buttons
        .tab-button(:class="{active:!store.orderStatus}" v-on:click="setOrderStatus(0)") On
        .tab-button(:class="{active:store.orderStatus}" v-on:click="setOrderStatus(1)") Off
    hr
    router-link.button(v-if="stores.length>1" to="/store") 매장 보기
    router-link.button.button-red(v-if="!auth.member" to="/login") 로그인
    .button.button-red.button-member(v-if="auth.member" v-on:click="logout")
      span.name {{auth.member.name}}
      span 로그아웃
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      auth: {},
      stores: [],
      store: {},
      orders: [],
      flag_restarting_clients: 0,
      time: {
        now: 0,
        start: 0,
        end: 0,
      },
    };
  },
  methods: {
    restart(url) {
      if (!url) {
        url = '/';
      }
      window.location = url;
    },
    removeAuth() {
      if (confirm('매장을 떠나시겠습니까?')) {
        this.auth = {};
        this.$cookies.remove("auth", null, null);
        this.restart('/');
      }
    },
    setServiceStatus(value) {
      if (value) {
        this.$eventBus.$emit('openConfirmModal', {
          title: '태블릿 닫기',
          message: '모든 태블릿의 화면을 닫아요',
          confirm: function() {
            let url = 'http://admin.torder.co.kr/store/shop_close';
            let fd = new FormData();
            fd.append('store_code', this.auth.store.code);
            axios
              .post(url, fd)
              .then(function(res) {
                console.log(res);
                this.$eventBus.$emit('closeConfirmModal');
                this.store.serviceStatus = value;
              }.bind(this));
          }.bind(this),
        });
      } else {
        this.$eventBus.$emit('openConfirmModal', {
          title: '태블릿 열기',
          message: '모든 태블릿의 화면을 열어요',
          confirm: function() {
            let url = 'http://admin.torder.co.kr/store/shop_open';
            let fd = new FormData();
            fd.append('store_code', this.auth.store.code);
            axios
              .post(url, fd)
              .then(function(res) {
                console.log(res);
                this.$eventBus.$emit('closeConfirmModal');
                this.store.serviceStatus = value;
              }.bind(this));
          }.bind(this),
        });
      }
    },
    setOrderStatus(value) {
      if (!value) {
        this.$eventBus.$emit('openConfirmModal', {
          title: '주문 받기',
          message: '태블릿에서 주문을 받아요',
          confirm: function() {
            let url = 'http://admin.torder.co.kr/store/shop_open_order';
            let fd = new FormData();
            fd.append('store_code', this.auth.store.code);
            axios
              .post(url, fd)
              .then(function(res) {
                console.log(res);
                this.$eventBus.$emit('closeConfirmModal');
                this.store.orderStatus = value;
              }.bind(this));
          }.bind(this),
        });
      } else {
        this.$eventBus.$emit('openConfirmModal', {
          title: '주문 중단',
          message: '태블릿을 메뉴판으로만 사용하고 주문은 안돼요',
          confirm: function() {
            let url = 'http://admin.torder.co.kr/store/shop_close_order';
            let fd = new FormData();
            fd.append('store_code', this.auth.store.code);
            axios
              .post(url, fd)
              .then(function(res) {
                console.log(res);
                this.$eventBus.$emit('closeConfirmModal');
                this.store.orderStatus = value;
              }.bind(this));

          }.bind(this),
        });
      }
    },
  },
};
</script>
