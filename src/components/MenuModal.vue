<template lang="pug">
#menuBoard(v-if="show")
  .background(@click="close")
  .container
    .top
      .wrap
        .table-number {{tableName}}
      .wrap
        .title 주문하기
      .buttons
        .button(@click="openTableOrders()") 주문내역보기
    .body
      .left
        ul.list-category.first(v-if="topCategorise")
          li.item-category(
            v-for="category in topCategorise"
            @click="selectFirstCategory(category)"
            :class="getTopCategoriseClass(category)"
          ) {{getMenuName(category)}}

        ul.list-category.second(v-if="first_category_code" ref="secondCategoryList")
          li.item-category(
            v-for="ctg in getSubCategorise()"
            @click="selectSecondCategory(ctg)"
            :class="getSubCategoriesClass(ctg)"
          ) {{getMenuName(ctg)}}

        ul.list-product(v-if="second_category_code" ref="productList")
          li.item-product(
            v-for="product in getChooseProudcts()"
            @click="selectProduct(product)"
          )
            .name {{getGoodDisplayName(product)}}
            .price {{getGoodDefualtPrice(product)}}원
      .right
        ul.select-product-list(v-if="show_select_products" ref="selectProductList")
          li.select-product-item(v-for="select_product in select_products_sorted")
            .button.button-plus(@click="plusQtyProduct(select_product)") +
            .info
              .info-top
                .name {{getSelectedGoodDisplayName(select_product)}}
                .qty {{getSelectedGoodQty(select_product)}}개
              .info-bottom
                .price {{getSelectedGoodDefualtPrice(select_product)}}원
                .qty-price {{getSelectedGoodQtyPrice(select_product)}}원
            .button.button-minus(@click="minusQtyProduct(select_product)") -
    .foot
      .buttons
        .button(@click="close") 닫기
        .button.button-red(@click="submit")
          .info {{select_products_length}}가지 {{select_products_qty}}개 {{select_products_price}}원
          .text 주문하기
</template>

<script>
/* eslint-disable no-prototype-builtins */
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    onClose: {
      type: Function,
      default: () => {},
    },
    tableName: {
      type: String,
      default: '',
    },
    tableId: {
      type: String,
      default: '',
    },
    onTableOrder: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      first_category: undefined,
      first_category_code: undefined,
      second_category: undefined,
      second_category_code: undefined,
      show_select_products: true,
      select_products: {},
      select_products_length: 0,
      select_products_qty: 0,
      select_products_price: 0,
      select_products_sorted: [],
    };
  },
  computed: {
    topCategorise() {
      const { categories } = this.$store.state;
      return categories.filter((item) => item.T_order_store_menu_depth.includes('1'));
    },
    categorys() {
      return this.$store.state.categories;
    },
    products() {
      return this.$store.state.goods;
    },
  },
  methods: {
    getTopCategoriseClass(category) {
      if (!category?.T_order_store_menu_code) return { select: false };
      const select = category.T_order_store_menu_code === this.first_category_code;
      return { select };
    },
    getSubCategoriesClass(category) {
      if (!category?.T_order_store_menu_code) return { select: false };
      const select = category.T_order_store_menu_code === this.second_category_code;
      return { select };
    },
    getMenuName: (category) => category?.T_order_store_menu_name,
    getGoodDisplayName: (product) => product?.T_order_store_good_display_name,
    getGoodDefualtPrice(product) {
      if (!product?.T_order_store_good_defualt_price) return 0;
      return product.T_order_store_good_defualt_price;
    },
    getSelectedGoodDisplayName(select_product) {
      return this.getGoodDisplayName(select_product?.product);
    },
    getSelectedGoodQty(select_product) {
      if (!select_product?.qty) return 0;
      return select_product.qty;
    },
    getSelectedGoodDefualtPrice(select_product) {
      return this.getGoodDefualtPrice(select_product?.product);
    },
    getSelectedGoodQtyPrice(select_product) {
      const qty = this.getSelectedGoodQty(select_product);
      const defaultPrice = this.getSelectedGoodDefualtPrice(select_product);
      const sum = qty * defaultPrice;
      return sum;
    },
    getInfoText() {
      return `${this.select_products_length}가지 ${this.select_products_qty}개 ${this.select_products_price}원`;
    },
    async submit() {
      const { auth } = this.$store.state;
      const store_shop_code = auth.store.store_code;
      const tablet_number = this.tableId;
      // console.log('tablet_number', this.tableId);
      const store_good_code = [];
      const store_good_qty = [];

      const frm = new FormData();
      frm.set('store_shop_code', store_shop_code);
      frm.set('tablet_number', tablet_number);

      for (const productCode in this.select_products) {
        const item = this.select_products[productCode];
        const code = item.product.T_order_store_good_code;
        const qty = item.qty;

        store_good_code.push(code);
        store_good_qty.push(qty);
        frm.append('store_good_code[]', code);
        frm.append('store_good_qty[]', qty);
      }
      await this.$store.dispatch('requestOrder', frm);

      // const res = await this.$store.dispatch('requestOrder', frm);
      // console.log(res);
    },
    openTableOrders() {
      this.onTableOrder();
      this.close();
    },
    getSubCategorise() {
      const categorise = [...this.categorys];

      return categorise.filter((ctg) => ctg.T_order_store_menu_depth.includes(this.first_category_code));
    },
    getChooseProudcts() {
      const arr = [...this.products].filter((item) => {
        try {
          if (!item.T_order_store_good_category) {
            return null;
          }
          const idx = item.T_order_store_good_category.findIndex((o) => {
            return o === this.second_category_code;
          });
          if (idx === -1) {
            return null;
          }
          return item;
        } catch (error) {
          return null;
        }
      });
      return arr;
    },
    selectFirstCategory(category) {
      const menuCode = category.T_order_store_menu_code;
      this.first_category = category;
      this.first_category_code = menuCode;

      this.$nextTick(() => {
        this.$refs.secondCategoryList.scrollTop = 0;
      });
    },
    selectSecondCategory(category) {
      const code = category.T_order_store_menu_code;
      this.second_category = category;
      this.second_category_code = code;

      this.$nextTick(() => {
        this.$refs.productList.scrollTop = 0;
      });
    },
    // old method
    plusQtyProduct(select_product) {
      select_product.qty += 1;
      this.updateCart();
      this.show_select_products = false;
      this.show_select_products = true;
    },
    minusQtyProduct(select_product) {
      select_product.qty -= 1;

      if (select_product.qty < 1) {
        const code = select_product.product.T_order_store_good_code;
        delete this.select_products[code];
      }

      this.updateCart();
      this.show_select_products = false;
      this.show_select_products = true;
    },
    updateCart() {
      this.select_products_length = Object.keys(this.select_products).length;

      let price = 0;
      let qty = 0;
      for (const key in this.select_products) {
        const select_product = this.select_products[key];
        price += select_product.qty * select_product.product.T_order_store_good_defualt_price;
        qty += select_product.qty;
      }

      this.select_products_qty = qty;
      this.select_products_price = price;

      const keys = Object.keys(this.select_products).sort((a, b) => {
        return this.select_products[b].time - this.select_products[a].time;
      });

      this.select_products_sorted = [];
      for (const code of keys) {
        this.select_products_sorted.push(this.select_products[code]);
      }
    },
    selectProduct(product) {
      const code = product.T_order_store_good_code;
      const current_time = Date.now();

      // if (Object.prototype.hasOwnProperty.call(this.select_products, code)) {

      if (this.select_products.hasOwnProperty(code))  {
        this.select_products[code].qty += 1;
        this.select_products[code].time = current_time;
      } else {
        this.select_products[code] = {
          product: product,
          qty: 1,
          time: current_time,
        };
      }

      this.updateCart();
      this.show_select_products = false;
      this.show_select_products = true;
    },
    close() {
      this.first_category= undefined;
      this.first_category_code= undefined;
      this.second_category= undefined;
      this.second_category_code= undefined;
      this.select_products= {};
      this.select_products_length = 0;
      this.select_products_qty = 0;
      this.select_products_price = 0;
      this.select_products_sorted = [];
      this.onClose();
    },
  },
};
</script>

<style lang="scss">
@import "../scss/global.scss";
#menuBoard {
  @include modal;
  .container {
    > .body {
      > .left {
        width:70%;
        overflow:scroll;

        .list-category {
          display:flex;
          width:25%;
          flex-shrink:0;
          margin:0;
          padding:0;
          overflow:scroll;
          flex-direction: column;

          .item-category {
            min-width: 100px;
            display:flex;
            align-items: center;
            justify-content: center;
            text-align:center;
            padding:12px 24px;
            background-color:#202020;
            color:#ffffff;
            font-size:20px;
            font-weight:900;
            border-radius:24px;
            margin:4px;
            word-break:keep-all;
            margin-top: 10px;
          }
          .item-category:active,
          .item-category.select {
            background-color:#ff0000;
            color:#ffffff;
          }
        }
        .list-product {
          display:flex;
          flex-grow:1;
          flex-direction:column;
          margin:0;
          padding:0;
          overflow:scroll;

          .item-product {
            display:flex;
            align-items: center;
            justify-content: center;
            background-color:#202020;
            color:#ffffff;
            font-size:20px;
            padding:12px 24px;
            border-radius:24px;
            margin:4px;

            .name {
              flex-grow:1;
              margin-right:24px;
              word-break:keep-all;
              font-weight:900;
            }
            .price {
              font-size:0.8em;
              word-break:keep-all;
            }
          }
          .item-product:active {
            background-color:#ff0000;
            color:#ffffff;
          }
        }
      }
      > .right {
        background-color: transparent;
        width:30%;
        h2 {
          margin:4px;
        }

        .select-product-list {
          display:flex;
          flex-direction:column;
          margin:0;
          padding:0;
          width:100%;
          word-break:keep-all;
          overflow:scroll;

          .select-product-item {
            display:flex;
            align-items: center;
            justify-content: center;
            padding:4px 0;
            border-top:solid 1px #eaeaea;
            font-weight:900;
            font-size:16px;
            margin: 0;

            > .button {
              display:flex;
              flex-direction:column;
              flex-shrink:0;
              align-items: center;
              width:1em;
              height:1em;
              font-size:1.8em;
              font-weight:400;
              line-height:0.9em;
              border-radius:100px;
              background-color:#202020;
              color:#ffffff;
              margin:0 8px;
            }
            > .button:active {
              background-color:#848484;
            }

            > .info {
              display:flex;
              flex-direction:column;
              flex-grow:1;

              .info-top {
                display:flex;
                justify-content: space-between;

                .name {
                  word-break:break-all;
                }
                .qty {
                  margin-left:8px;
                }
              }
              .info-bottom {
                display:flex;
                justify-content: space-between;
                margin-top:4px;
                padding-top:4px;
                font-size:1em;
              }
            }
          }
          .select-product-item:first-child {
            border-top:none;
          }
        }
      }
    }
  }
}
</style>
