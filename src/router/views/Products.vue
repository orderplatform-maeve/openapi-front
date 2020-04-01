<template lang="pug">
.container
  .main-categories
    .main-category(
      v-for="ctgItem in data"
      :key="ctgItem.code"
      @click="() => onSelectMainCtg(ctgItem)"
    ) {{ ctgItem.name }}
  .sub-categories
    .sub-category(
      v-for="subCtgItem in getSubCategories()"
      :key="subCtgItem.code"
      @click="() => onSelectSubCtg(subCtgItem)"
    ) {{ subCtgItem.name }}
  .goods
    .good(v-for="good in getGoods()" :key="good.code") {{ good.displayName }}
</template>

<script>
export default {
  data() {
    return {
      selectMainCtegoryItem: null,
      selectSubCategoryItem: null,
    };
  },
  computed: {
    data() {
      const { processGoods, getCategories } = this.$store.getters;

      const results = getCategories.map((categoryItem) => {
        const subCategories = categoryItem.subCategories.map((subCategoryItem) => {
          const obj = {
            ...subCategoryItem,
            goods: processGoods.filter((p) => {
              if (p.categories) {
                const subCategory = subCategoryItem.code;
                return p.categories.includes(subCategory);
              }
            }),
          };
          return obj;
        });
        const chunk = {
          ...categoryItem,
          subCategories,
        };

        return chunk;
      });

      console.log(results);
      return results;
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
      console.log(item);
      this.selectMainCtegoryItem = item;
    },
    getSubCategories() {
      try {
        const { data, selectMainCtegoryItem } = this;

        if (selectMainCtegoryItem) return selectMainCtegoryItem.subCategories;

        return data[0].subCategories;

      } catch (error) {
        console.error(error);
        return [];
      }
    },
    onSelectSubCtg(item) {
      this.selectSubCategoryItem = item;
    },
    getGoods() {
      try {
        const { data, selectSubCategoryItem } = this;

        if (selectSubCategoryItem) return selectSubCategoryItem.goods;

        return data[0].subCategories[0].goods;
      } catch (e) {
        console.error(e);
        return [];
      }
    }
  },
};
</script>

<style lang="scss">
.container{
  background-color: red;
  overflow: auto;
  .main-categories {
    display: flex;
    justify-content: space-between;
    .main-category {
      display: flex;
      background-color: blue;
      flex-grow: 1;
      justify-content: center;
    }
  }
  .sub-categories {
    display: flex;
    justify-content: space-between;
    .sub-category {
      display: flex;
      background-color: green;
      flex-grow: 1;
      justify-content: center;
    }
  }

  .goods {
    flex-direction: column;
    .good {
      background-color: black;
      display: flex;
      margin-top: 8px;
      flex-grow: 1;
    }
  }

}
</style>
