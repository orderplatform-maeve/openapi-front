<template lang="pug">
.top-box
  #container
    .left-box
      .top
        <table>
          <tr>
            <th>주문 번호</th>
            <td>1231312</td>
          </tr>
          <tr>
            <th>테이블</th>
            <td>25</td>
          </tr>
          <tr>
            <th>담당자</th>
            <td>마스터</td>
          </tr>
        </table>
        <table>
          <tr>
            <th>주문시간</th>
            <th>10:14:47</th>
          </tr>
          <tr>
            <th>고객수</th>
            <td>$0</td>
          </tr>
          <tr>
            <th>특기사항</th>
            <td></td>
          </tr>
        </table>
      .bill
        .top
          p 상품명
          p 수량
          p 할인
          p 금액
          p 비고
        .body(v-if="previousOrders")
          .row(v-for="order in previousOrders")
            p {{ order.display_name }}
            p {{ order.order_qty }}
            p discount
            p {{ order.good_price }}
            p etc
        .footer
          p {{ previousOrders.length }} 건
          p 합계
    .right-box
      .main-categories
        .main-category(
          v-for="ctgItem in menu"
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
      .scroll
        .good(v-for="good in getGoods()" :key="good.code") {{ good.displayName }}
          p ₩ {{ good.price }}
  .footer
    p 주문
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
    previousOrders() {
      return this.$store.state.cartList;
    },
    menu() {
      const { getCategoriesGoods } = this.$store.getters;
      return getCategoriesGoods;
    },
  },
  async mounted() {
    await this.getMenu();
    await this.getPreviousOrders();
    this.getOrderData();
  },
  methods: {
    getGoods() {
      try {
        if (!this.selectSubCategoryItem) {
          return this.menu[0].subCategories[0].goods;
        }

        return this.selectSubCategoryItem.goods;
      } catch (error) {
        return [];
      }
    },
    getOrderData() {
      console.log(this.$store.state.orders);
    },
    async getMenu() {
      const fd = new FormData();
      const { store_code } = this.$store.state.auth.store;
      fd.append('store_code', store_code);

      const categories = await this.$store.dispatch('setCategories', fd);
      const goods = await this.$store.dispatch('setGooods', fd);
      // console.log('categories', categories, goods);

      const noData = !categories || !goods;

      if (noData) return false;

      return true;
    },
    async getPreviousOrders() {
      console.log(this.$route.params.id);

      const fd = new FormData();
      const { store_code } = this.$store.state.auth.store;
      fd.append('store_code', store_code);
      fd.append('tablet_number', this.$route.params.id);

      const orders = await this.$store.dispatch('setTableCartList', fd);
      // console.log(orders);
      if (!orders) return false;

      return true;
    },
    onSelectMainCtg(item) {
      this.selectMainCategoryItem = item;
      this.selectSubCategoryItem = item.subCategories[0];
    },
    getActiveMainCategory(targetCode) {
      try {
        const { menu, selectMainCategoryItem } = this;

        if (!selectMainCategoryItem) {
          const isDefaultActive = targetCode === menu[0].code;
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
    getSubCategories() {
      try {
        const { menu, selectMainCategoryItem } = this;

        if (selectMainCategoryItem) return selectMainCategoryItem.subCategories;

        return menu[0].subCategories;

      } catch (error) {
        return [];
      }
    },
    onSelectSubCtg(item) {
      this.selectSubCategoryItem = item;
    },
    getActiveSubCategory(targetCode) {
      try {
        const { menu, selectSubCategoryItem } = this;

        if (!selectSubCategoryItem) {
          const isDefaultActive = targetCode === menu[0].subCategories[0].code;
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
.top-box{
  display: flex;
  flex: 1;
  flex-direction: column;
  #container {
    --c-1: #ffffff;
    --c-2: #202020;
    --c-3: #ff0000;
    --c-7: #e0e0e0;
    --c-8: #fafafa;
    --c-9: #efefef;
    --c-10: #000000;

    display: flex;
    flex: 1;
    overflow: hidden;
    .left-box {
      width: 50%;
      background-color: silver;
      .top {
        display: flex;
      }
      .bill {
        .top {
          width: 100%;
          background-color: green;
          padding: 10px;
          box-sizing: border-box;
          display: flex;
          justify-content: space-around;
        }
        .body {
          width: 100%;
          background-color: orange;
          padding: 10px;
          box-sizing: border-box;

          .row {
            display: flex;
            justify-content: space-around;
          }
        }
        .footer {
          display: flex;
          justify-content: space-around;
          background-color: aqua;
        }
      }
    }
    .right-box {
      width: 50%;
      background-color: blue;

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
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        flex-shrink: 0;
        background-color: violet;
        height: calc(100% - 116px);
        padding: 10px 4px;
        box-sizing: border-box;
        justify-content: center;

        .good {
          width: calc(33.3333% - 16px);
          height: 15vh;
          border: 1px solid black;
          margin: 4px;
          border-radius: 4px;
          padding: 4px;
          box-sizing: border-box;
          display: flex;
          flex-grow: 1;
        }
      }

    }
  }

  .footer {
    height: 50px;
  }
}
</style>
