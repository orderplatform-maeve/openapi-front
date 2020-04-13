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
      @click="() => onSelectSubCtg(subCtgItem)"
      :class="getActiveSubCategory(subCtgItem.code)"
    ) {{ subCtgItem.name }}
  .goods
    .good(v-for="good in getFilterGoods()" :key="good.code")
      .good-image(:style="getGoodImage(good.image)")
      .good-info
        .name {{ good.displayName }}
        .button {{ getUseStatusText(good.noUse) }}
        .button {{ getSoldoutStatusText(good.soldout) }}
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
      const { processGoods, getCategories } = this.$store.getters;

      const getCategoryItem = (categoryItem) => {
        const getSubCategoryItem = (subCategoryItem) => this.getSubCategoryItem(subCategoryItem, processGoods);
        const subCategories = categoryItem.subCategories.map(getSubCategoryItem);

        return {
          ...categoryItem,
          subCategories,
        };
      };

      return getCategories.map(getCategoryItem);
    },
  },
  async mounted() {
    const fd = new FormData();
    fd.append('store_code', this.$store.state.auth.store.store_code);
    await this.$store.dispatch('setCategories', fd);
    await this.$store.dispatch('setGooods', fd);
  },
  methods: {
    onSelectMainCtg(item) {
      this.selectMainCategoryItem = item;
      this.selectSubCategoryItem = item.subCategories[0];
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
    },
    getFilterGoods() {
      try {
        const { data, selectSubCategoryItem } = this;

        if (selectSubCategoryItem) return selectSubCategoryItem.goods;

        return data[0].subCategories[0].goods;
      } catch (e) {
        return [];
      }
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
    getFilteredGoods(goods, subCategory) {
      const findGoods = (good) => {
        const { categories } = good;

        if (categories) {
          return categories.includes(subCategory);
        }
      };

      return goods.filter(findGoods);
    },
    getSubCategoryItem(subCategoryItem, processGoods) {
      const goods = this.getFilteredGoods(processGoods, subCategoryItem.code);

      return {
        ...subCategoryItem,
        goods,
      };
    },
    getGoodImage(image) {
      return  {
        backgroundImage: `url(${image})`,
      };
    },
    getUseStatusText(noUse) {
      return noUse ? '판매 재개' : '판매 중지';
    },
    getSoldoutStatusText(soldout) {
      return soldout ? '품절 취소' : '품절 처리';
    }
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

  overflow: auto;
  .main-categories {
    display: flex;
    justify-content: space-between;
    .main-category {
      display: flex;
      flex-grow: 1;
      justify-content: center;
      font-weight: 900;
      font-size: 32px;
      height: 60px;
      align-items: center;
    }
    .active {
      color: var(--c-3);
    }
  }
  .sub-categories {
    display: flex;
    justify-content: space-between;
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

  .goods {
    flex-wrap: wrap;
    align-items: flex-start;
    flex-shrink: 0;
    .good {
      width: calc(33.3333% - 16px);
      height: 50vh;
      background-color: var(--c-9);
      display: flex;
      margin: 8px;
      color: var(--c-2);
      flex-direction: column;
      border-radius: 4px;
      box-shadow: 0 0 8px -4px var(--c-7);
      .good-image {
        flex-grow: 1;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      }
      .good-info {
        display: flex;
        flex-direction: column;
        padding: 12px;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-size: 24px;
        font-weight: 900;
        word-break: normal;
        .name {
          text-align: center;
          font-size: 24px;
          font-weight: 900;
          word-break: normal;
        }
        .button {
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px 16px;
          font-weight: 900;
          margin-top: 8px;
          color: var(--c-9);
          background-color: var(--c-2);
          border-radius: 20px;
        }
      }
    }
  }

}
</style>
