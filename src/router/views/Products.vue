<template lang="pug">
.container
  .main-categories
    a.main-category(
      v-for="ctgItem in data"
      :key="ctgItem.code"
      @click="() => onSelectMainCtg(ctgItem)"
      :class="getActiveMainCategory(ctgItem.code)"
      :href="`#${ctgItem.code}`"
      :ref="ctgItem.code"
    ) {{ ctgItem.name }}
  .sub-categories
    a.sub-category(
      v-for="subCtgItem in getSubCategories()"
      :key="subCtgItem.code"
      :name="subCtgItem.code"
      @click="() => onSelectSubCtg(subCtgItem)"
      :class="getActiveSubCategory(subCtgItem.code)"
      :href="`#${subCtgItem.code}`"
      :ref="subCtgItem.code"
    ) {{ subCtgItem.name }}

  .scroll(@scroll="handleScroll" ref="scroll")
    .products(v-for="mainCtg in data" :key="mainCtg.code" :id="mainCtg.code")
      .goods(class="scrollem" v-for="subCtg in mainCtg.subCategories" :id="subCtg.code")
        .category-info
          .main-category-text {{ mainCtg.name }}
          .sub-category-text {{ subCtg.name }}
        .good(
          v-for="good in subCtg.goods"
          :key="good.code"
        )
          .good-image(:style="getGoodImage(good.image)")
          .good-info
            .name {{ good.displayName }}
            .button(@click="() => onNoUse(good)") {{ getUseStatusText(good.noUse) }}
            .button(@click="() => onSoldoutStatus(good)") {{ getSoldoutStatusText(good.soldout) }}
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

      const results = getCategories.map(getCategoryItem);
      console.log(results);

      return results;
    },
  },
  async mounted() {
    await this.initialize();
    if (!this.selectSubCategoryItem) {
      // console.log('initialize', this.data[0].subCategories[0].goods);
      this.selectSubCategoryItem = this.data[0].subCategories[0];
    }
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
        return this.selectSubCategoryItem.goods;
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
      if (!image) return null;
      return  {
        backgroundImage: `url(${image})`,
      };
    },
    getUseStatusText(noUse) {
      return noUse ? '판매 재개 하기' : '판매 중지 하기';
    },
    getSoldoutStatusText(soldout) {
      return soldout ? '품절 취소 하기' : '품절 처리 하기';
    },
    onNoUse(good) {
      const { noUse } = good;

      if (noUse) {
        return this.onSelling(good);
      }

      return this.onStopSelling(good);
    },
    async onStopSelling(good) {
      const { store_code } = this.$store.state.auth.store;

      const params = {
        params: {
          store_code,
          good_code: good.code,
          type: 'goodOff',
        },
      };

      const res = await this.$store.dispatch('updateGoodStatusType', params);
      console.log(res);

      if (res.status === 200) {
        const findIdx = this.selectSubCategoryItem.goods.findIndex((item) => good.code === item.code);
        console.log('finde index', this.selectSubCategoryItem.goods[findIdx].noUse);

        const arr = JSON.parse(JSON.stringify(this.selectSubCategoryItem.goods));
        arr[findIdx] = {
          ...this.selectSubCategoryItem.goods[findIdx],
          noUse: 1,
        };

        this.selectSubCategoryItem = {
          ...this.selectSubCategoryItem,
          goods: arr,
        };

        console.log('changed', this.selectSubCategoryItem.goods[findIdx].noUse);
      } else {
        alert('서버가 불안정하여 판매 중지 하기 실패하였습니다.');
      }
    },
    async onSelling(good) {
      const { store_code } = this.$store.state.auth.store;

      const params = {
        params: {
          store_code,
          good_code: good.code,
          type: 'goodOn',
        },
      };

      const res = await this.$store.dispatch('updateGoodStatusType', params);
      console.log(res);

      if (res.status === 200) {
        const findIdx = this.selectSubCategoryItem.goods.findIndex((item) => good.code === item.code);
        console.log('finde index', this.selectSubCategoryItem.goods[findIdx].noUse);

        const arr = JSON.parse(JSON.stringify(this.selectSubCategoryItem.goods));
        arr[findIdx] = {
          ...this.selectSubCategoryItem.goods[findIdx],
          noUse: 0,
        };

        this.selectSubCategoryItem = {
          ...this.selectSubCategoryItem,
          goods: arr,
        };

        console.log('changed', this.selectSubCategoryItem.goods[findIdx].noUse);
      } else {
        alert('서버가 불안정하여 판매 중지 하기 실패하였습니다.');
      }
    },
    onSoldoutStatus(good) {
      const { soldout } = good;

      if (soldout) {
        return this.onSale(good);
      }

      return this.onSoldout(good);
    },
    async onSoldout(good) {
      const { store_code } = this.$store.state.auth.store;

      const params = {
        params: {
          store_code,
          good_code: good.code,
          type: 'goodNoSale',
        },
      };

      const res = await this.$store.dispatch('updateGoodStatusType', params);
      console.log(res);

      if (res.status === 200) {
        const findIdx = this.selectSubCategoryItem.goods.findIndex((item) => good.code === item.code);
        console.log('finde index', this.selectSubCategoryItem.goods[findIdx].noUse);

        const arr = JSON.parse(JSON.stringify(this.selectSubCategoryItem.goods));
        arr[findIdx] = {
          ...this.selectSubCategoryItem.goods[findIdx],
          soldout: 1,
        };

        this.selectSubCategoryItem = {
          ...this.selectSubCategoryItem,
          goods: arr,
        };

        console.log('changed', this.selectSubCategoryItem.goods[findIdx].noUse);
      } else {
        alert('서버가 불안정하여 판매 중지 하기 실패하였습니다.');
      }
    },
    async onSale(good) {
      const { store_code } = this.$store.state.auth.store;

      const params = {
        params: {
          store_code,
          good_code: good.code,
          type: 'goodOnSale',
        },
      };

      const res = await this.$store.dispatch('updateGoodStatusType', params);
      console.log(res);

      if (res.status === 200) {
        const findIdx = this.selectSubCategoryItem.goods.findIndex((item) => good.code === item.code);
        console.log('finde index', this.selectSubCategoryItem.goods[findIdx].noUse);

        const arr = JSON.parse(JSON.stringify(this.selectSubCategoryItem.goods));
        arr[findIdx] = {
          ...this.selectSubCategoryItem.goods[findIdx],
          soldout: 0,
        };

        this.selectSubCategoryItem = {
          ...this.selectSubCategoryItem,
          goods: arr,
        };

        console.log('changed', this.selectSubCategoryItem.goods[findIdx].noUse);
      } else {
        alert('서버가 불안정하여 판매 중지 하기 실패하였습니다.');
      }
    },
    async initialize() {
      const fd = new FormData();
      fd.append('store_code', this.$store.state.auth.store.store_code);
      await this.$store.dispatch('setCategories', fd);
      await this.$store.dispatch('setGooods', fd);
    },
    getGoodItemVisible(good) {
      try {
        let style = null;

        if (this.selectSubCategoryItem) {
          const array = this.selectSubCategoryItem.goods;
          const findIdx = array.findIndex((o) => o.code === good.code);

          if (findIdx === -1) {
            style = {
              display: 'none',
            };
          }
        }

        return style;
      } catch (error) {
        return { display: 'none' };
      }
    },
    handleScroll(e) {
      const products = e.target.children;
      let elBottom = 0;
      let subElBottom = 0;

      [...products].forEach((el, i) => {
        const elTop = el.offsetTop - this.$refs.scroll.offsetTop;
        elBottom += el.offsetHeight;
        const { scrollTop } = e.target;

        // console.log(i, elTop, elBottom, scrollTop, el.id, targetId);
        if (elTop <= scrollTop && elBottom >= scrollTop) {
          // console.log(i, elTop, elBottom, scrollTop, el.id);

          const findItem = this.data.find((o) => o.code === el.id);
          this.selectMainCategoryItem = findItem;
        }

        [...el.children].forEach((element) => {
          const subElTop = element.offsetTop - this.$refs.scroll.offsetTop;
          subElBottom += element.offsetHeight;

          if (subElTop <= scrollTop && subElBottom >= scrollTop) {
            // console.log(subElTop, subElBottom, scrollTop, element.id);
            const findSubItem = this.getSubCategories().find((o) => o.code === element.id);
            this.selectSubCategoryItem = findSubItem;
          }

        });
      });
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

  .scroll {
    overflow: auto;
    flex-direction: column;
    .products {
      flex-direction: column;
      .goods {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        flex-shrink: 0;
        .category-info {
          width: calc(33.3333% - 16px);
          height: 50vh;
          display: flex;
          margin: 8px;
          color: var(--c-3);
          flex-direction: column;
          font-size: 4vh;
          font-weight: 100;
          position: relative;
          text-align: center;
          justify-content: center;

          .sub-category-text {
            font-size: 8vh;
            text-align: right;
            margin-top: 4vh;
            padding-top: 4vh;
          }
          .sub-category-text::after {
            content: "";
            position: absolute;
            top: 50%;
            right: -100px;
            height: 2px;
            width: calc(50% + 100px);
            background-color: var(--c-3);
          }
        }
        .good {
          z-index: 2;
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
  }

}
</style>
