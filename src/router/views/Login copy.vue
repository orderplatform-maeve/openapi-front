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
    .button(v-on:click='submit') 로그인하기
</template>
<script>
import axios from 'axios';

export default {
  props: ['auth'],
  data() {
    return {
      id: '',
      pw: '',
    };
  },
  created: function () {
    if (this.auth && this.auth.member) {
      this.$router.push({name: 'store'});
    }
  },
  methods: {
    submit() {
      if (this.id && this.pw) {
        let req_data = {
          id: this.id,
          pw: this.pw,
        };
        axios
          .post('http://api.auth.order.orderhae.com/login', req_data)
          .then(function(res) {
            if (res.data.length) {
              let data = res.data[0];
              let member = {
                code: data['T_order_id'],
                name: data['T_order_member_name'],
              };

              this.auth.member = member;
              this.$eventBus.$emit('saveAuth');
              this.$eventBus.$emit('setStores');
              //this.$eventBus.$emit('setStores');

              this.$router.push({
                name: 'store',
              });
            } else {
              alert('아이디와 비밀번호를 확인해주세요.');
            }
          }.bind(this)).catch(function(err) {
            console.log({err: err});
          }).finally(function () {
          });
      }
    },
    check() {
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
