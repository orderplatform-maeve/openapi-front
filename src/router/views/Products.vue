<template lang="pug">
.container
  div(v-for="ctg in data")
    ul {{ ctg.name }}
      li(v-for="subCtg in ctg.subCategories") {{ subCtg.name }}
  .good(v-for="good in goods" :key="good.code")
    p {{ good.displayName }}
    //- p {{ good.soldout }}
</template>

<script>
export default {
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
};
</script>

<style lang="scss">
.container{
  background-color: red;
  overflow: auto;
  .good {
    background-color: green;
    display: flex;
    margin-top: 8px;
  }
}
</style>
