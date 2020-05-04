<template lang="pug">
.top-box
  modal-product-option(
    :show="optionModal"
    :product="selectedProduct"
    :onSubmit="optionMdalConfirm"
    :close="optionModalClose"
  )
  #container
    .left-box
      .top
        .order-table
          .table-row
            .table-row-title 주문번호
            .table-row-content {{ getOrderId() }}
          .table-row
            .table-row-title 테이블
            .table-row-content {{ getOrderTableNum() }}
        .order-table
          .table-row
            .table-row-title 주문시간
            .table-row-content {{ getOrderTime() }}
          .table-row
            .table-row-title 고객수
            .table-row-content {{ getOrderCustomerCount() }}
      .bill
        .bill-top
          .bill-category.product-title 상품명
          .bill-category.product-qty 수량
          .bill-category.product-price 금액
        .wrapper
          .bill-body(v-if="previousOrders" ref="billBody")
            .row(
              v-for="(order, orderIdx) in previousOrders"
              :class="getLastBorder(orderIdx)"
            )
              .order
                .order-text.product-title
                  .title {{ order.display_name }}
                .order-text.product-qty {{ order.order_qty }}
                .order-text.product-price {{ getPrice(order.good_price) }}
              .option(v-for="option in order.option")
                .option-text.product-title
                  .title ┕▷ {{ option.display_name }}
                .option-text.product-qty {{ option.order_qty }}
                .option-text.product-price {{ option.pos_price }}
        .bill-footer
          .counter {{ getOrderCount() }} 건
          .total 합계: {{ getTotalPrice() }}
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
        .good(
          v-for="good in getGoods()"
          :key="good.code"
          @click="() => selectGood(good)"
        )
          p {{ good.displayName }}
          p ₩ {{ getPrice(good.price) }}
  .footer
    .button.order(@click="yesOrder") 주문
    .button(@click="onDeleteOrder") 삭제
    .button(@click="close") 닫기
</template>

<script>
import { won } from '@utils/regularExpressions';
import paths from '@router/paths';

export default {
  data() {
    return {
      selectMainCategoryItem: null,
      selectSubCategoryItem: null,
      cartList: [],
      order: null,
      optionModal: false,
      selectedProduct: null,
    };
  },
  computed: {
    previousOrders() {
      // console.log(this.$store.state.cartList);
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
    await this.getOrderData();
  },
  destroyed() {
    this.$store.commit('SET_TABLE_CART_LIST', []);
  },
  methods: {
    close() {
      this.$router.replace(paths.tables);
    },
    getPrice(price) {
      try {
        return won(price);
      } catch (error) {
        return 0;
      }
    },
    getOrderId() {
      return this.order?.order_id;
    },
    getOrderTableNum() {
      return this.order?.T_order_order_tablet_number;
    },
    getOrderTime() {
      return this.order?.order_time;
    },
    getOrderCustomerCount() {
      return this.order?.People;
    },
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
    async getOrderData() {
      try {
        const { store_code } = this.$store.state.auth.store;
        const fd = new FormData();
        fd.append('shop_code', store_code);
        // fd.append('tablet_number', this.$route.params.id);

        const res = await this.$store.dispatch('setOrders', fd);
        const currentOrder =  res.data.find((o) => o.table_number === this.$route.params.id);
        // console.log('currentOrder', currentOrder);

        const parseOrder = JSON.parse(currentOrder.json_data);
        // console.log(parseOrder);

        this.order = parseOrder;
      } catch (error) {
        console.log(error);
      }
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
      const fd = new FormData();
      const { store_code } = this.$store.state.auth.store;
      fd.append('store_code', store_code);
      fd.append('tablet_number', this.$route.params.id);

      const order = await this.$store.dispatch('setTableCartList', fd);
      // console.log(orders);
      if (!order) return false;

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
    selectGood(good) {
      if (good.options && good.options.length) {
        const clone = JSON.parse(JSON.stringify(good));

        if (clone.options) {
          let g_index = 0;

          clone.options.map((g) => {
            g.noOption = true;
            g.index = g_index;
            g.selected_count = 0;
            g.option_items.map((o) => {
              o.qty = 0;
              o.group = g;
            });

            g_index += 1;
            g.option_items.sort((a, b) => {
              return a.sort_number - b.sort_number;
            });
          });
          clone.options.sort((a, b) => {
            return a.sort_number - b.sort_number;
          });
        }

        this.selectedProduct = clone;
        console.log('options', this.selectedProduct);

        this.optionModal = true;
      } else {
        const result = {
          option: good.options,
          img_url: good.image,
          pos_code: good.posCode,
          pos_name: good.name,
          cart_show: String(good.hideInCart),
          good_code: good.code,
          order_qty: 1,
          pos_price: good.price,
          good_items: "", // 서버개발자에게 물어봐야함
          good_price: good.price,
          order_time: Math.floor(+ new Date() / 1000),
          display_name: good.displayName,
          pos_order_id: '', // 서버개발자에게 물어봐야함
        };

        this.cartList = [...this.cartList, result];
        const newCartList = [...this.previousOrders, result];

        this.billScrollBottom();

        this.$store.commit('SET_TABLE_CART_LIST', newCartList);
      }
    },
    billScrollBottom() {
      setTimeout(() => {
        // this.$refs.billBody.scrollTo(0, this.$refs.billBody.scrollHeight);
        this.$refs.billBody.scrollTop = this.$refs.billBody.scrollHeight;
      }, 0);
    },
    yesOrder() {
      if (this.cartList && this.cartList.length) {
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        const fd = new FormData();
        const { store_code } = this.$store.state.auth.store;
        fd.append('store_shop_code', store_code);
        fd.append('tablet_number', this.$route.params.id);

        for (const [i, order] of this.cartList.entries()) {
          console.log('order', order);
          fd.append('orders['+i+'][code]', order.good_code); // 주문 코드가 필요
          fd.append('orders['+i+'][qty]', order.order_qty);
        }

        const payload = {
          params: fd,
          config,
        };

        const res = this.$store.dispatch('yesOrder', payload);

        if (res) {
          this.cartList = [];
        } else {
          this.$store.commit('pushFlashMessage', '주문 실패하였습니다.');
        }
      } else {
        this.$store.commit('pushFlashMessage', '새로운 주문이 없습니다.');
      }
    },
    optionModalClose() {
      setTimeout(() => {
        this.optionModal = false;
      }, 0);
    },
    optionMdalConfirm(rednerOrder, requestOrder) {
      console.log('confirm', requestOrder);

      this.cartList = [...this.cartList, requestOrder];
      const newCartList = [...this.previousOrders, rednerOrder];

      this.billScrollBottom();
      this.$store.commit('SET_TABLE_CART_LIST', newCartList);
      this.optionModalClose();
    },
    getOrderCount() {
      const { previousOrders } = this;
      try {
        return previousOrders.length;
      } catch (error) {
        return 0;
      }
    },
    getTotalPrice() {
      const { previousOrders } = this;
      try {
        let total = 0;

        previousOrders.forEach((order) => {
          total += Number(order.good_price);
          if (order?.option) {
            order.option.forEach((option) => {
              total += Number(option.pos_price);
            });
          }
        });
        return won(total);
      } catch (error) {
        return 0;
      }
    },
    getLastBorder(orderIdx) {
      const { previousOrders } = this;
      const targetCount = previousOrders.length - 1;
      if (orderIdx === targetCount) {
        return {
          last: false,
        };
      }
    },
    async onDeleteOrder() {
      try {
        const { store_code } = this.$store.state.auth.store;
        const fd = new FormData();
        fd.append('store_code', store_code);
        fd.append('table_id', this.$route.params.id);

        const res = await this.$store.dispatch('resetOrder', fd);
        console.log(res);
      } catch (error) {
        this.$store.commit('pushFlashMessage', '주문이 이미 없습니다.');
      }
    },
  },
};
</script>

<style lang="scss">
p {
  margin: 0;
}

.top-box{
  display: flex;
  flex: 1;
  flex-direction: column;

  --c-1: #ffffff;
  --c-2: #202020;
  --c-3: #ff0000;
  --c-7: #e0e0e0;
  --c-8: #fafafa;
  --c-9: #efefef;
  --c-10: #000000;

  #container {
    display: flex;
    flex: 1;
    overflow: hidden;
    .left-box {
      display: flex;
      flex-direction: column;
      width: 50%;
      overflow: hidden;
      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        flex-shrink: 0;
        .order-table {
          padding: 4px;
          flex-grow: 1;
          font-size: 20px;
          display: flex;
          flex-direction: column;
          .table-row {
            display: flex;
            border: 1px solid var(--c-7);
            padding: 4px;
            .table-row-title {
              display: flex;
              flex-grow: 1;
              font-weight: 900;
              max-width: 80px;
              justify-content: center;
              align-items: center;
              border-right: 1px solid var(--c-7);
            }
            .table-row-content {
              font-size: 12px;
              display: flex;
              flex-grow: 1;
              justify-content: center;
              align-items: center;
            }
          }
        }
      }
      .bill {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        overflow: hidden;
        margin-top: 8px;
        .bill-top {
          width: 100%;
          padding: 8px 0 8px 0;
          box-sizing: border-box;
          display: flex;
          border-bottom: 1px solid var(--c-7);
          flex-shrink: 0;
          .bill-category {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 20px;
            font-weight: 900;
          }
          .bill-category.product-title {
            width: 60%;
          }
          .bill-category.product-qty {
            width: 15%;
            border-left: 1px solid var(--c-7);
          }
          .bill-category.product-price {
            width: 25%;
            border-left: 1px solid var(--c-7);
          }
        }
        .wrapper {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          overflow: hidden;
        }
        .bill-body {
          padding: 8px 0 8px 0;
          box-sizing: border-box;
          overflow-y: auto;
          .row {
            display: flex;
            flex-direction: column;
            border-bottom: 1px solid var(--c-7);
            box-sizing: border-box;

            .order {
              height: 60px;
              display: flex;
              justify-content: center;
              align-items: center;
              .order-text {
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 20px;
                padding: 8px 0 8px 0;
                box-sizing: border-box;
              }
              .order-text.product-title {
                width: 60%;
                .title {
                  width: 100%;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  text-align: left;
                  padding-left: 8px;
                  box-sizing: border-box;
                }
              }
              .order-text.product-qty {
                width: 15%;
                justify-content: flex-end;
                padding-right: 8px;
                box-sizing: border-box;
              }
              .order-text.product-price {
                width: 25%;
                justify-content: flex-end;
                padding-right: 8px;
                box-sizing: border-box;
              }
            }

            .option {
              height: 60px;
              display: flex;
              justify-content: center;
              align-items: center;
              border-top: 1px solid var(--c-7);
              .option-text {
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 20px;
                padding: 8px 0 8px 0;
                box-sizing: border-box;
              }
              .option-text.product-title {
                width: 60%;
                .title {
                  width: 100%;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  text-align: left;
                }
              }
              .option-text.product-qty {
                width: 15%;
                justify-content: flex-end;
                padding-right: 8px;
                box-sizing: border-box;
              }
              .option-text.product-price {
                width: 25%;
                justify-content: flex-end;
                padding-right: 8px;
                box-sizing: border-box;
              }
            }
          }
          .row.last {
            border-bottom: 1px dashed var(--c-3);
          }
        }
        .bill-footer {
          display: flex;
          justify-content: flex-end;
          border-top: 1px dashed var(--c-7);
          padding: 16px 0 16px 0;
          box-sizing: border-box;
          font-size: 20px;
          font-weight: 600;
          flex-shrink: 0;

          .counter {
            width: 15%;;
            text-align: end;
            padding-right: 8px;
            box-sizing: border-box;
          }

          .total {
            min-width: 25%;
            padding-right: 8px;
            box-sizing: border-box;
            text-align: end;
          }
        }
      }
    }
    .right-box {
      display: flex;
      flex-direction: column;
      width: 50%;
      overflow: hidden;
      border-left: 1px solid var(--c-7);

      .main-categories {
        display: flex;
        justify-content: space-between;
        flex-shrink: 0;

        .main-category {
          display: flex;
          flex-grow: 1;
          justify-content: center;
          font-weight: 900;
          font-size: 24px;
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
        flex-wrap: wrap;

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
        border-top: 1px solid var(--c-7);
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        padding: 10px 4px;
        box-sizing: border-box;
        justify-content: center;
        flex-grow: 1;
        overflow-y: auto;

        .good {
          width: calc(33.3333% - 16px);
          height: 15vh;
          margin: 4px;
          background-color: var(--c-1);
          border-radius: 4px;
          padding: 4px;
          box-sizing: border-box;
          display: flex;
          flex-grow: 1;
          color: var(--c-10);
          font-size: 20px;
          font-weight: 800;
          justify-content: space-around;
          align-items: center;
          flex-direction: column;
          text-align: center;
        }
      }

    }
  }

  .footer {
    display: flex;
    height: 100px;
    justify-content: space-around;
    align-items: center;
    border-top: 2px solid var(--c-7);

    .button {
      padding: 10px 60px;
      background-color: white;
      font-size: 36px;
      color: black;
      font-weight: 800;
      border-radius: 20px;
    }

    .button.order {
      background-color: var(--c-3);
      color: white;
    }

  }
}
</style>
