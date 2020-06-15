<template lang="pug">
.container
  .main-categories
    .main-category(
      v-for="ctgItem in data"
      :key="ctgItem.code"
      @click="() => onSelectMainCtg(ctgItem)"
      :class="getActiveMainCategory(ctgItem.code)"
    ) {{ ctgItem.name }}
  .sub-categories
    .sub-category(
      v-for="subCtgItem in getSubCategories()"
      :key="subCtgItem.code"
      :name="subCtgItem.code"
      @click="() => onSelectSubCtg(subCtgItem)"
      :class="getActiveSubCategory(subCtgItem.code)"
    ) {{ subCtgItem.name }}
</template>

<script>
export default {
  data() {
    return {
      selectMainCategoryItem: null,
      selectSubCategoryItem: null,
    };
  },
  computed: {
    data() {
      const { getCategoriesGoods } = this.$store.getters;
      return getCategoriesGoods;
    },
  },
  watch: {
    data(newData) {
      if (!this.selectSubCategoryItem) {
        // console.log(newData[0].subCategories[0]);
        this.selectSubCategoryItem = newData[0].subCategories[0];
      }
    },
  },
  async mounted() {
    await this.initialize();
  },
  methods: {
    async initialize() {

      const fd = new FormData();
      fd.append('store_code', this.$store.state.auth.store.store_code);
      const ctgRes = await this.$store.dispatch('setCategories', fd);

      console.log(ctgRes);
    },
    onSelectMainCtg(item) {
      this.selectMainCategoryItem = item;
      this.selectSubCategoryItem = item.subCategories[0];

      const elTop = this.$refs[item.code][0].offsetTop - this.$refs.scroll.offsetTop;
      this.$refs.scroll.scrollTo(0, elTop);
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
    onSelectSubCtg(item) {
      this.selectSubCategoryItem = item;

      const elTop = this.$refs[item.code][0].offsetTop - this.$refs.scroll.offsetTop;
      this.$refs.scroll.scrollTo(0, elTop);
    },
    getActiveMainCategory(targetCode) {
      try {
        const { data, selectMainCategoryItem } = this;

        if (!selectMainCategoryItem) {
          const isDefaultActive = targetCode === data[0].code;
          if (isDefaultActive) {
            return 'active';
          }
          return '';
        }

        const isSelectedActive = selectMainCategoryItem.code === targetCode;
        if (isSelectedActive) return 'active';

        return '';
      } catch (error) {
        console.error(error);
        return '';
      }
    },
    getActiveSubCategory(targetCode) {
      try {
        const { data, selectSubCategoryItem } = this;

        if (!selectSubCategoryItem) {
          const isDefaultActive = targetCode === data[0].subCategories[0].code;
          if (isDefaultActive) {
            return 'active';
          }
          return '';
        }

        const isSelectedActive = selectSubCategoryItem.code === targetCode;
        if (isSelectedActive) return 'active';

        return '';
      } catch (error) {
        console.error(error);
        return '';
      }
    },
  },
};
</script>

<style lang="scss">
.container{
  a {
    text-decoration: none;
    color: var(--c-1);
  }

  --c-1: #ffffff;
  --c-2: #202020;
  --c-3: #ff0000;
  --c-7: #e0e0e0;
  --c-8: #fafafa;
  --c-9: #efefef;
  --c-10: #000000;

  overflow: auto;
  .main-categories {
    display: flex;
    justify-content: space-between;
    flex-shrink: 0;
    .main-category {
      display: flex;
      flex-grow: 1;
      justify-content: center;
      font-weight: 900;
      font-size: 32px;
      height: 60px;
      align-items: center;
      padding: 0 20px;
    }
    .active {
      color: var(--c-3);
    }
  }
  .sub-categories {
    display: flex;
    justify-content: space-between;
    flex-shrink: 0;
    .sub-category {
      display: flex;
      flex-grow: 1;
      justify-content: center;
      margin: 4px;
      height: 44px;
      font-weight: 900;
      font-size: 16px;
      align-items: center;
      padding: 0 20px;
    }
    .active {
      color: var(--c-3);
      border-radius: 24px;
      border: solid 2px var(--c-3);
    }
  }

}
</style>
