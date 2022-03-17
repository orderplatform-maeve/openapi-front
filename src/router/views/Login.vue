<template lang="pug">
.container
  .top
    .title 로그인을 해주세요.
  .body
    form#login-form
      .input
        input(name="id" type="text" placeholder="아이디" v-model="id")
      .input
        input(name="pw" type="password" placeholder="비밀번호" v-model="pw")
  .bottom
    .button(@click='onLogin') 로그인하기
</template>

<script>
import paths from '@router/paths';

export default {
  data() {
    return {
      id: '',
      pw: '',
    };
  },
  methods: {
    async onLogin() {
      const {
        id,
        pw,
      } = this;

      if (id && pw) {

        const fd = new FormData();

        fd.append('member_id', id.toLowerCase());
        fd.append('member_pwd', pw);

        const isLogin = await this.$store.dispatch('login', fd);
        if (isLogin) {
          // await this.$store.dispatch('noticePopup/updateNoticePopupData');
          // // console.log(this.$router.push, paths.store);

          this.$router.push(paths.store);
        }
      }
    },
  }
};
</script>

<style lang="scss">
.container {
  flex: 1;
  color:#ffffff;
  padding: 0.78125vw 1.5625vw !important;
  box-sizing: border-box;

  .top .title {
    font-size:24px;
  }
  .body {
    form {
      margin-top:24px;
      display:flex;
      flex-grow:1;
      flex-direction:column;
      .input {
        display:flex;
        margin-bottom:24px;
        input {
          display:flex;
          flex-grow:1;
          height:60px;
          border-radius:20px;
          border:solid 1px #eaeaea;
          padding: 0 16px;
          font-size:20px;
          margin-bottom:20px;
        }
      }
      .input:last-child {
        margin-bottom:0;
      }
    }
  }
  .bottom {
    .button {
      display:flex;
      align-items:center;
      justify-content:center;
      background-color:#ff0000;
      color:#ffffff;
      height:60px;
      font-size:20px;
      border-radius:20px;
    }
  }
}
</style>
