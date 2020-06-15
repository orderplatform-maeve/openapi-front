<template lang="pug">
.container
  .main-card(
    v-for="ctgItem in data"
    :key="ctgItem.code"
  ) {{ ctgItem.name }}
    .sub-category(
      v-for="subCtgItem in ctgItem.subCategories"
      :key="subCtgItem.code"
    ) {{ subCtgItem.name }}
      .button(@click="() => subOpen(subCtgItem.code)") open
      .button(@click="() => subClose(subCtgItem.code)") close
</template>

<script>
export default {
  data() {
    return {
      selectMainCategoryItem: null,
    };
  },
  computed: {
    data() {
      const { getCategoriesGoods } = this.$store.getters;
      console.log(getCategoriesGoods);
      return getCategoriesGoods;
    },
  },
  async mounted() {
    await this.initialize();
  },
  methods: {
    async initialize() {
      const fd = new FormData();
      fd.append('store_code', this.$store.state.auth.store.store_code);
      await this.$store.dispatch('setCategories', fd);
    },
    getSubCategories() {
      try {
        const { data, selectMainCategoryItem } = this;
        if (selectMainCategoryItem) return selectMainCategoryItem.subCategories;
        return data[0].subCategories;
      } catch (error) {
        return [];
      }
    },
    async subOpen(code) {
      const fd = new FormData();
      fd.append('store_code', this.$store.state.auth.store.store_code);
      fd.append('good_categroty_code', code);

      const res = await this.$store.dispatch('updateCategoryOpne', fd);
      console.log(res);
    },
    async subClose(code) {
      const fd = new FormData();
      fd.append('store_code', this.$store.state.auth.store.store_code);
      fd.append('good_categroty_code', code);

      const res = await this.$store.dispatch('updateCategoryClose', fd);
      console.log(res);
    },
  },
};
</script>

<style lang="scss">
.container{
  --c-1: #ffffff;
  --c-2: #202020;
  --c-3: #ff0000;
  --c-7: #e0e0e0;
  --c-8: #fafafa;
  --c-9: #efefef;
  --c-10: #000000;

  .main-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-weight: 900;
    font-size: 32px;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid var(--c-7);

    .sub-category {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin: 4px;
      font-weight: 900;
      font-size: 24px;
      align-items: center;
      padding: 20px;
    }
  }
}
</style>
