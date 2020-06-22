<template lang="pug">
.container
  .card(
    v-for="ctgItem in data"
    :key="ctgItem.code"
  )
    .header {{ ctgItem.name }} (메인 카테고리)
      .toggles
        button(@click="() => open(subCtgItem.code)") open
        button(@click="() => close(subCtgItem.code)") close
    .sub-category(
      v-for="subCtgItem in ctgItem.subCategories"
      :key="subCtgItem.code"
    ) {{ subCtgItem.name }}
      button(@click="() => open(subCtgItem.code)") open
      button(@click="() => close(subCtgItem.code)") close
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
      const { getAllCategories } = this.$store.getters;
      console.log(getAllCategories);
      return getAllCategories;
    },
  },
  async mounted() {
    await this.initialize();
  },
  methods: {
    async initialize() {
      const fd = new FormData();
      fd.append('store_code', this.$store.state.auth.store.store_code);
      await this.$store.dispatch('setAllCategories', fd);
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
    async open(code) {
      const fd = new FormData();
      fd.append('store_code', this.$store.state.auth.store.store_code);
      fd.append('good_categroty_code', code);

      const res = await this.$store.dispatch('updateCategoryOpne', fd);
      console.log(res);
    },
    async close(code) {
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

  .card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--c-9);
    border-radius: 8px;
    color: var(--c-2);
    padding: 16px;
    box-sizing: border-box;

    .header {
      display: flex;
      font-weight: 900;
      font-size: 32px;
      justify-content: space-between;
      width: 100%;
      align-items: center;
      border-bottom: .8px solid var(--c-2);

      .toggles {
        display: flex;
        align-items: center;
      }
    }

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
