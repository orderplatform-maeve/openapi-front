<template lang="pug">
.new-products-container
  p.new-products-title 상품관리(신)(테스트)
  .main-categories
    .main-category(
      v-for="ctgItem in data"
      :key="ctgItem.code"
      @click="() => onSelectMainCtg(ctgItem)"
      :class="getActiveMainCategory(ctgItem.code)"
    ) {{ ctgItem.name }}
  .background-white
    .sub-categories
      .sub-category(
        v-for="subCtgItem in getSubCategories()"
        :key="subCtgItem.code"
        :name="subCtgItem.code"
        @click="() => onSelectSubCtg(subCtgItem)"
        :class="getActiveSubCategory(subCtgItem.code)"
      ) {{ subCtgItem.name }}
    .loading(v-if="isLoading") 데이터 요청 중 입니다.
    .product-list
      .scroll(@scroll="handleScroll" ref="scroll" v-if="!isLoading")
        .new-products(
          v-for="mainCtg in data"
          :key="mainCtg.code"
          :id="mainCtg.code"
          :ref="mainCtg.code"
        )
          .new-product-goods-list(
            v-for="subCtg in mainCtg.subCategories"
            :id="subCtg.code"
            :ref="subCtg.code"
          )
            p.wrap-category-name
              span.main-cateogry-name {{mainCtg.name}}
              span.bar |
              span.sub-category-name {{subCtg.name}}
            .new-product-goods(
              v-for="good in subCtg.goods"
              :key="good.code"
            )
              p.new-product-good-name {{ good.displayName }}
              .good-buttons
                .button(@click="() => onNoUse(good)" :class="getButtonStatusStyle(good.noUse)") {{ getUseStatusText(good.noUse) }}
                .button(@click="() => onSoldoutStatus(good)" :class="getButtonStatusStyle(good.soldout)") {{ getSoldoutStatusText(good.soldout) }}
                .button(@click="() => onBestStatus(good)" :class="getButtonStatusStyle(good.best)") {{ getBestStatusText(good.best) }}
                .button(@click="() => onHitStatus(good)" :class="getButtonStatusStyle(good.hit)") {{ getHitStatusText(good.hit) }}
                .button(@click="() => onMdStatus(good)" :class="getButtonStatusStyle(good.md)") {{ getMdStatusText(good.md) }}
                .button(@click="() => onSaleStatus(good)" :class="getButtonStatusStyle(good.sale)") {{ getSaleStatusText(good.sale) }}
                .button(@click="() => onNewStatus(good)" :class="getButtonStatusStyle(good.new)") {{ getNewStatusText(good.new) }}
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
      const { getNewCategoriesGoods } = this.$store.getters;
      return getNewCategoriesGoods;
    },
  },
  watch: {
    data(newData) {
      if (!this.selectSubCategoryItem) {
        // console.log(newData[0].subCategories[0]);
        this.selectSubCategoryItem = newData[0]?.subCategories[0];
      }
    },
  },
  mounted() {
    this.initialize();
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
      return soldout ? '메뉴 품절 취소' : '메뉴 품절';
    },
    getBestStatusText(best) {
      return best ? '베스트 취소' : '베스트 적용';
    },
    getHitStatusText(isVisivle) {
      return isVisivle ? '히트 취소' : '히트 적용';
    },
    getMdStatusText(isVisivle) {
      return isVisivle ? '추천 취소' : '추천 적용';
    },
    getSaleStatusText(isVisivle) {
      return isVisivle ? '할인 취소' : '할인 적용';
    },
    getNewStatusText(isVisivle) {
      return isVisivle ? '신제품 취소' : '신제품 적용';
    },
    getButtonStatusStyle(visible) {
      if (visible) {
        return 'buttonActive';
      }
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

      const config = await this.$store.dispatch('setMenuConfig', fd);

      const { categorys, goods } = config;
      const categories = categorys;

      // console.log( goods[0]);
      // const ctgRes = await this.$store.dispatch('setCategories', fd);
      // const goodsRes = await this.$store.dispatch('setGoods', fd);
      // console.log(ctgRes[0], categories[0]);
      // console.log(goodsRes[0], goods[0]);

      if (categories && goods) {
        setTimeout(() => {
          this.isLoading = false;
        }, 0);
      }
    },
    unVisibleScroll() {
      const mainCategories = document.querySelector('.main-categories');
      const clientWidth = mainCategories.clientWidth;

      const target = document.querySelector('.active');
      const targetLeft = target?.getBoundingClientRect().left;

      if(targetLeft) {
        if(clientWidth - targetLeft < 0) {
          mainCategories.scrollBy({
            left: clientWidth,
            top: 0,
            behavior: 'smooth',
          });
        } else if(targetLeft < 0){
          mainCategories.scrollBy({
            left: -clientWidth,
            top: 0,
            behavior: 'smooth',
          });
        }
      }
    },
    handleScroll(e) {
      this.unVisibleScroll();
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
    onNewStatus(good) {
      const isNew = good.new;
      if (isNew) return this.offNew(good);
      return this.onNew(good);
    },
    async offNew(good) {
      const { store_code } = this.$store.state.auth.store;

      const params = {
        params: {
          store_code,
          good_code: good.code,
          type: 'goodOffNew',
        },
      };

      const res = await this.$store.dispatch('updateGoodStatusType', params);
      // console.log(res);

      if (res.status === 200) {
        const arr = JSON.parse(JSON.stringify(this.$store.state.goods));
        const findIdx = arr.findIndex((o) => o.T_order_store_good_code === good.code);

        arr[findIdx] = {
          ...arr[findIdx],
          type_new: 0,
        };

        this.reqEmitProductStatus(good, arr[findIdx]);
        this.$store.commit('SET_GOODS', arr);
      } else {
        this.$store.commit('pushFlashMessage', '서버가 불안정하여 판매 중지 하기 실패하였습니다.');
      }
    },
    async onNew(good) {
      const { store_code } = this.$store.state.auth.store;

      const params = {
        params: {
          store_code,
          good_code: good.code,
          type: 'goodOnNew',
        },
      };

      const res = await this.$store.dispatch('updateGoodStatusType', params);
      // console.log(res);

      if (res.status === 200) {
        const arr = JSON.parse(JSON.stringify(this.$store.state.goods));
        const findIdx = arr.findIndex((o) => o.T_order_store_good_code === good.code);

        arr[findIdx] = {
          ...arr[findIdx],
          type_new: 1,
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

<style lang="scss" scoped>
a {
  text-decoration: none;
}

.new-products-container {
  flex: 1;
  font-family: 'Spoqa Han Sans Neo', 'sans-serif';
  color:#ffffff;
  padding: 0.390625vw 0 0 !important;
  box-sizing: border-box;
  overflow: auto;

  .new-products-title {
    font-family: "notosans";
    font-weight: bold;
    font-size: 1.71875vw;
    padding: 1.5625vw 0 1.5625vw !important;
    color: #fff;
  }

  .main-categories {
    display: flex;
    align-items: center;
    gap: 0.78125vw;
    max-width: 84.53125vw;
    overflow: auto;

    .main-category {
      font-size: 1.5625vw;
      color: #ddd;
      letter-spacing: -0.0390625vw;
      background-color: #404144;
      padding: 1.328125vw 1.5625vw !important;
      box-sizing: border-box;
      border-top-left-radius: 1.015625vw;
      border-top-right-radius: 1.015625vw;
      white-space:nowrap;
      word-break: keep-all;
    }

    .active {
      color: #000;
      font-weight: bold;
      background-color: #fff;
    }
  }

  .background-white {
    background-color: #fff;

    .sub-categories {
      display: flex;
      align-items: center;
      gap: 0.78125vw;
      width: 84.53125vw;
      padding: 1.5625vw 0 1.5625vw 1.5625vw !important;
      box-sizing: border-box;
      overflow: scroll;

      .sub-category {
        font-size: 1.406250vw;
        letter-spacing: -0.03515625vw;
        color: #666;
        background-color: #e5e5e5;
        padding: 0.9375vw 2.34375vw !important;
        border: none;
        border-radius: 1.015625vw;
        white-space:nowrap;
        word-break: keep-all;
        box-sizing: border-box;
      }

      .active {
        color: #fff;
        font-weight: bold;
        background-color: #000;
      }
    }

    .product-list {
      position: relative;
      max-height: calc(100vh - 18.125vw);
      display: flex;
      gap: 1.5625vw;
      padding: 0 0.78125vw 0.78125vw !important;
      box-sizing: border-box;

      .scroll {
        flex: 1;
        overflow: auto;
        padding-left: 1.5625vw !important;
        box-sizing: border-box;

        .new-products {
          .new-product-goods-list {
            margin-top: 2.34375vw !important;

            .wrap-category-name {
              display: flex;
              align-items: center;
              gap: 1.5625vw;

              .main-cateogry-name {
                font-size: 1.875vw;
                color: #fc0000;
                font-weight: bold;
                letter-spacing: -0.09375vw;
              }

              .bar {
                font-size: 1.875vw;
                color: #999;
              }

              .sub-category-name {
                font-size: 1.875vw;
                letter-spacing: -0.09375vw;
                color: #000;
              }
            }
            .new-product-goods {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 1.5234375vw 0 !important;
              border-bottom: solid 0.078125vw #ccc;

              .new-product-good-name {
                flex: 1;
                font-size: 1.71875vw;
                color: #000;
                font-weight: bold;
                word-break: break-all;
              }
              .good-buttons {
                display: flex;
                align-items: center;
                gap: 0.390625vw;

                .button {
                  width: 7.8125vw;
                  height: 2.8125vw;
                  font-size: 1.25vw;
                  letter-spacing: -0.0625vw;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  color: #000;
                  border: solid 0.078125vw #000;
                  border-radius: 0.390625vw;
                  box-sizing: border-box;
                }

                .buttonActive {
                  color: #fc0000;
                  border: solid 0.15625vw #fc0000;
                  background-color: #ffefef;
                }
              }
            }
          }
        }

        .new-products:first-child {
          margin-top: -2.34375vw !important;
        }
      }
    }
  }
}

</style>
