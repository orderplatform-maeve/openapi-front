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

  .loading(v-if="isLoading") 데이터 요청 중 입니다.
  .scroll(@scroll="handleScroll" ref="scroll" v-if="!isLoading")
    .products(v-for="mainCtg in data" :key="mainCtg.code" :id="mainCtg.code" :ref="mainCtg.code")
      .goods(v-for="subCtg in mainCtg.subCategories" :id="subCtg.code" :ref="subCtg.code")
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
            .good-buttons
              .button(@click="() => onNoUse(good)" :style="getButtonStatusStyle(good.noUse)") {{ getUseStatusText(good.noUse) }}
              .button(@click="() => onSoldoutStatus(good)" :style="getButtonStatusStyle(good.soldout)") {{ getSoldoutStatusText(good.soldout) }}
              .button(@click="() => onBestStatus(good)" :style="getButtonStatusStyle(good.best)") {{ getBestStatusText(good.best) }}
              .button(@click="() => onHitStatus(good)" :style="getButtonStatusStyle(good.hit)") {{ getHitStatusText(good.hit) }}
              .button(@click="() => onMdStatus(good)" :style="getButtonStatusStyle(good.md)") {{ getMdStatusText(good.md) }}
              .button(@click="() => onSaleStatus(good)" :style="getButtonStatusStyle(good.sale)") {{ getSaleStatusText(good.sale) }}
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
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
    getGoodImage(image) {
      if (!image) return null;
      return  {
        backgroundImage: `url(${image})`,
      };
    },
    getUseStatusText(noUse) {
      return noUse ? '메뉴 재개' : '메뉴 중지';
    },
    getSoldoutStatusText(soldout) {
      return soldout ? '메뉴 품절 취소' : '매뉴 품절';
    },
    getBestStatusText(best) {
      return best ? '베스트 취소' : '베스트 적용';
    },
    getHitStatusText(best) {
      return best ? '히트 취소' : '히트 적용';
    },
    getMdStatusText(best) {
      return best ? '추천 취소' : '추천 적용';
    },
    getSaleStatusText(best) {
      return best ? '할인 취소' : '할인 적용';
    },
    getButtonStatusStyle(visble) {
      return {
        backgroundColor: `var(${visble ? '--c-3' : '--c-2'})`,
      };
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
      // console.log(res);

      if (res.status === 200) {
        const arr = JSON.parse(JSON.stringify(this.$store.state.goods));
        const findIdx = arr.findIndex((o) => o.T_order_store_good_code === good.code);

        arr[findIdx] = {
          ...arr[findIdx],
          T_order_store_good_use: 1,
        };

        this.reqEmitProductStatus(good, arr[findIdx]);
        this.$store.commit('SET_GOODS', arr);
      } else {
        this.$store.commit('pushFlashMessage', '서버가 불안정하여 판매 중지 하기 실패하였습니다.');
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
      // console.log(res);

      if (res.status === 200) {
        const arr = JSON.parse(JSON.stringify(this.$store.state.goods));
        const findIdx = arr.findIndex((o) => o.T_order_store_good_code === good.code);

        arr[findIdx] = {
          ...arr[findIdx],
          T_order_store_good_use: 0,
        };

        this.reqEmitProductStatus(good, arr[findIdx]);
        this.$store.commit('SET_GOODS', arr);
      } else {
        this.$store.commit('pushFlashMessage', '서버가 불안정하여 판매 중지 하기 실패하였습니다.');
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
      // console.log(res);

      if (res.status === 200) {
        const arr = JSON.parse(JSON.stringify(this.$store.state.goods));
        const findIdx = arr.findIndex((o) => o.T_order_store_good_code === good.code);

        arr[findIdx] = {
          ...arr[findIdx],
          T_order_store_good_soldout: 1,
        };

        this.reqEmitProductStatus(good, arr[findIdx]);
        this.$store.commit('SET_GOODS', arr);
      } else {
        this.$store.commit('pushFlashMessage', '서버가 불안정하여 판매 중지 하기 실패하였습니다.');
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
      // console.log(res);

      if (res.status === 200) {
        const arr = JSON.parse(JSON.stringify(this.$store.state.goods));
        const findIdx = arr.findIndex((o) => o.T_order_store_good_code === good.code);

        arr[findIdx] = {
          ...arr[findIdx],
          T_order_store_good_soldout: 0,
        };

        this.reqEmitProductStatus(good, arr[findIdx]);
        this.$store.commit('SET_GOODS', arr);
      } else {
        this.$store.commit('pushFlashMessage', '서버가 불안정하여 판매 중지 하기 실패하였습니다.');
      }
    },
    async initialize() {
      this.isLoading = true;

      const fd = new FormData();
      fd.append('store_code', this.$store.state.auth.store.store_code);
      const ctgRes = await this.$store.dispatch('setCategories', fd);
      const goodsRes = await this.$store.dispatch('setGooods', fd);

      if (ctgRes && goodsRes) {
        setTimeout(() => {
          this.isLoading = false;
        }, 0);
      }
    },
    handleScroll(e) {
      const products = e.target.children;
      let elBottom = 0;
      let subElBottom = 0;

      [...products].forEach((el) => {
        const elTop = el.offsetTop - this.$refs.scroll.offsetTop;
        elBottom += el.offsetHeight;
        const { scrollTop } = e.target;

        // // console.log(i, elTop, elBottom, scrollTop, el.id, targetId);
        if (elTop <= scrollTop && elBottom >= scrollTop) {
          // // console.log(i, elTop, elBottom, scrollTop, el.id);

          const findItem = this.data.find((o) => o.code === el.id);
          this.selectMainCategoryItem = findItem;
        }

        [...el.children].forEach((element) => {
          const subElTop = element.offsetTop - this.$refs.scroll.offsetTop;
          subElBottom += element.offsetHeight;

          if (subElTop <= scrollTop && subElBottom >= scrollTop) {
            // // console.log(subElTop, subElBottom, scrollTop, element.id);
            const findSubItem = this.getSubCategories().find((o) => o.code === element.id);
            this.selectSubCategoryItem = findSubItem;
          }

        });
      });
    },
    reqEmitProductStatus(good, data) {
      this.$socket.emit('orderview', {
        store: {
          code: this.$store.state.auth.store.store_code,
        },
        type: '@put/product/status',
        good,
        data,
      });
    },
    onBestStatus(good) {
      const { best } = good;

      if (best) {
        return this.offBest(good);
      }

      return this.onBest(good);
    },
    async offBest(good) {
      const { store_code } = this.$store.state.auth.store;

      const params = {
        params: {
          store_code,
          good_code: good.code,
          type: 'goodOffBest',
        },
      };

      const res = await this.$store.dispatch('updateGoodStatusType', params);
      // console.log(res);

      if (res.status === 200) {
        const arr = JSON.parse(JSON.stringify(this.$store.state.goods));
        const findIdx = arr.findIndex((o) => o.T_order_store_good_code === good.code);

        arr[findIdx] = {
          ...arr[findIdx],
          type_best: 0,
        };

        this.reqEmitProductStatus(good, arr[findIdx]);
        this.$store.commit('SET_GOODS', arr);
      } else {
        this.$store.commit('pushFlashMessage', '서버가 불안정하여 판매 중지 하기 실패하였습니다.');
      }
    },
    async onBest(good) {
      const { store_code } = this.$store.state.auth.store;

      const params = {
        params: {
          store_code,
          good_code: good.code,
          type: 'goodOnBest',
        },
      };

      const res = await this.$store.dispatch('updateGoodStatusType', params);
      // console.log(res);

      if (res.status === 200) {
        const arr = JSON.parse(JSON.stringify(this.$store.state.goods));
        const findIdx = arr.findIndex((o) => o.T_order_store_good_code === good.code);

        arr[findIdx] = {
          ...arr[findIdx],
          type_best: 1,
        };

        this.reqEmitProductStatus(good, arr[findIdx]);
        this.$store.commit('SET_GOODS', arr);
      } else {
        this.$store.commit('pushFlashMessage', '서버가 불안정하여 판매 중지 하기 실패하였습니다.');
      }
    },
    onHitStatus(good) {
      const { hit } = good;
      if (hit) return this.offHit(good);
      return this.onHit(good);
    },
    async offHit(good) {
      const { store_code } = this.$store.state.auth.store;

      const params = {
        params: {
          store_code,
          good_code: good.code,
          type: 'goodOffHit',
        },
      };

      const res = await this.$store.dispatch('updateGoodStatusType', params);
      // console.log(res);

      if (res.status === 200) {
        const arr = JSON.parse(JSON.stringify(this.$store.state.goods));
        const findIdx = arr.findIndex((o) => o.T_order_store_good_code === good.code);

        arr[findIdx] = {
          ...arr[findIdx],
          type_hit: 0,
        };

        this.reqEmitProductStatus(good, arr[findIdx]);
        this.$store.commit('SET_GOODS', arr);
      } else {
        this.$store.commit('pushFlashMessage', '서버가 불안정하여 판매 중지 하기 실패하였습니다.');
      }
    },
    async onHit(good) {
      const { store_code } = this.$store.state.auth.store;

      const params = {
        params: {
          store_code,
          good_code: good.code,
          type: 'goodOnHit',
        },
      };

      const res = await this.$store.dispatch('updateGoodStatusType', params);
      // console.log(res);

      if (res.status === 200) {
        const arr = JSON.parse(JSON.stringify(this.$store.state.goods));
        const findIdx = arr.findIndex((o) => o.T_order_store_good_code === good.code);

        arr[findIdx] = {
          ...arr[findIdx],
          type_hit: 1,
        };

        this.reqEmitProductStatus(good, arr[findIdx]);
        this.$store.commit('SET_GOODS', arr);
      } else {
        this.$store.commit('pushFlashMessage', '서버가 불안정하여 판매 중지 하기 실패하였습니다.');
      }
    },
    onMdStatus(good) {
      const { md } = good;
      if (md) return this.offMd(good);
      return this.onMd(good);
    },
    async offMd(good) {
      const { store_code } = this.$store.state.auth.store;

      const params = {
        params: {
          store_code,
          good_code: good.code,
          type: 'goodOffMd',
        },
      };

      const res = await this.$store.dispatch('updateGoodStatusType', params);
      // console.log(res);

      if (res.status === 200) {
        const arr = JSON.parse(JSON.stringify(this.$store.state.goods));
        const findIdx = arr.findIndex((o) => o.T_order_store_good_code === good.code);

        arr[findIdx] = {
          ...arr[findIdx],
          type_md: 0,
        };

        this.reqEmitProductStatus(good, arr[findIdx]);
        this.$store.commit('SET_GOODS', arr);
      } else {
        this.$store.commit('pushFlashMessage', '서버가 불안정하여 판매 중지 하기 실패하였습니다.');
      }
    },
    async onMd(good) {
      const { store_code } = this.$store.state.auth.store;

      const params = {
        params: {
          store_code,
          good_code: good.code,
          type: 'goodOnMd',
        },
      };

      const res = await this.$store.dispatch('updateGoodStatusType', params);
      // console.log(res);

      if (res.status === 200) {
        const arr = JSON.parse(JSON.stringify(this.$store.state.goods));
        const findIdx = arr.findIndex((o) => o.T_order_store_good_code === good.code);

        arr[findIdx] = {
          ...arr[findIdx],
          type_md: 1,
        };

        this.reqEmitProductStatus(good, arr[findIdx]);
        this.$store.commit('SET_GOODS', arr);
      } else {
        this.$store.commit('pushFlashMessage', '서버가 불안정하여 판매 중지 하기 실패하였습니다.');
      }
    },
    onSaleStatus(good) {
      const { sale } = good;
      if (sale) return this.offDiscount(good);
      return this.onDiscount(good);
    },
    async offDiscount(good) {
      const { store_code } = this.$store.state.auth.store;

      const params = {
        params: {
          store_code,
          good_code: good.code,
          type: 'goodOff_TypeSale',
        },
      };

      const res = await this.$store.dispatch('updateGoodStatusType', params);
      // console.log(res);

      if (res.status === 200) {
        const arr = JSON.parse(JSON.stringify(this.$store.state.goods));
        const findIdx = arr.findIndex((o) => o.T_order_store_good_code === good.code);

        arr[findIdx] = {
          ...arr[findIdx],
          type_sale: 0,
        };

        this.reqEmitProductStatus(good, arr[findIdx]);
        this.$store.commit('SET_GOODS', arr);
      } else {
        this.$store.commit('pushFlashMessage', '서버가 불안정하여 판매 중지 하기 실패하였습니다.');
      }
    },
    async onDiscount(good) {
      const { store_code } = this.$store.state.auth.store;

      const params = {
        params: {
          store_code,
          good_code: good.code,
          type: 'goodOn_TypeSale',
        },
      };

      const res = await this.$store.dispatch('updateGoodStatusType', params);
      // console.log(res);

      if (res.status === 200) {
        const arr = JSON.parse(JSON.stringify(this.$store.state.goods));
        const findIdx = arr.findIndex((o) => o.T_order_store_good_code === good.code);

        arr[findIdx] = {
          ...arr[findIdx],
          type_sale: 1,
        };

        this.reqEmitProductStatus(good, arr[findIdx]);
        this.$store.commit('SET_GOODS', arr);
      } else {
        this.$store.commit('pushFlashMessage', '서버가 불안정하여 판매 중지 하기 실패하였습니다.');
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
          height: 76vh;
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
            white-space: nowrap;
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
          height: 76vh;
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
          .good-buttons {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            box-sizing: border-box;
          }
        }
      }
    }
  }
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    font-size: 40px;
    font-weight: 900;
  }

}
</style>
