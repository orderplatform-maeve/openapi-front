<template lang="pug">
  .container
    .top
      .title {{auth.member ? auth.member.name : ''}}
    .body
      ul.store-list
        li.store-item(v-for="store in stores" :data-number="store.code")
          .name {{store.name}}
          .button.button-order(v-on:click='selectStore(store, "order")') 주문 보기
</template>
<script>

export default {
  props: {
    auth: {
      type: Object,
      default() {
        return {
          member: {},
          store: {},
        };
      },
    },
    stores: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    selectStore(store, type) {
      this.auth.store = store;
      this.$cookies.set('auth', this.auth, '1y', null, null);
      this.$store.dispatch('setAuth', this.auth);
      this.$router.push({ name: type });
    },
  },
};
</script>

<style lang="scss">
ul.store-list {
  display:flex;
  flex-grow:1;
  flex-direction:column;
  padding:0;
  margin:0;
  list-style:none;
  background-color:#272727;

  li.store-item {
    display:flex;
    align-items: center;
    flex-grow:1;
    flex-shrink:0;
    margin:0px;
    padding:4px 24px;
    border-bottom:solid 1px #484848;
    height:60px;
    color:#fafafa;
    font-size:20px;
    font-weight:900;

    .name {
      flex-grow:1
    }
    .order {
      display:flex;

      > * {
        margin-left:16px;
      }
    }
    .button {
      margin-left:24px;
      display:flex;
      align-items: center;
      justify-content: center;
      padding:0 24px;
      background-color:#fafafa;
      height:48px;
      border-radius:200px;
      color:#000000;
      font-size:16px;
    }
  }
}
</style>
