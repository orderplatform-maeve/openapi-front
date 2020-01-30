<template lang="pug">
.container
  .top
    .title 로그인을 해주세요.
  .body
    form#login-form
      .input
        input(name='id' type='text' placeholder="아이디" v-model="id")
      .input
        input(name='pw' type='password' placeholder="비밀번호" v-model="pw")
  .bottom
    .button(v-on:click='onLogin') 로그인하기
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      id: '',
      pw: '',
    };
  },
  methods: {
    ...mapActions([
      'login',
    ]),
    async onLogin() {
      const {
        id,
        pw,
      } = this;

      if (id && pw) {
        const params = {
          member_id: id,
          member_pwd: pw,
        };

        const isLogin = await this.login(params);

        console.log('isLogin', isLogin);

        if (isLogin) {
          this.$router.push('/store');
        }
      }
    },
  }
};
</script>

<style lang="scss">
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
      }
    }
    .input:last-child {
      margin-bottom:0;
    }
  }
}
</style>
