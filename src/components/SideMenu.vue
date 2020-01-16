<template lang="pug">
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
    router-link.button.button-red(v-if="!auth.member" to="/member") 로그인
    .button.button-red.button-member(v-if="auth.member" v-on:click="logout")
      span.name {{auth.member.name}}
      span 로그아웃
</template>

<script>
  export default {

  };
</script>
