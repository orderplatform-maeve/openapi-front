<template lang="pug">
#menuBoard(v-if="show")
  .background(v-on:click="close")
  .container
    .top
      .wrap
        .table-number {{table.name}}
      .wrap
        .title 주문하기
      .buttons
        .button(v-on:click="openTableOrders(table)") 주문내역보기
    .body
      .left
        ul.list-category.first
          li.item-category(v-for="category in categorys" v-if="category.T_order_store_menu_serviceUse==0&&category.T_order_store_menu_depth.includes('1')&&category.T_order_store_menu_use=='Y'" v-on:click="selectFirstCategory(category)" :class="{select: category.T_order_store_menu_code==first_category_code}") {{category.T_order_store_menu_name}}
        ul.list-category.second(v-if="first_category_code" ref="secondCategoryList")
          li.item-category(v-for="category in categorys" v-if="category.T_order_store_menu_serviceUse==0&&category.T_order_store_menu_depth.includes(first_category_code)&&category.T_order_store_menu_use=='Y'" v-on:click="selectSecondCategory(category)" :class="{select: category.T_order_store_menu_code==second_category_code}") {{category.T_order_store_menu_name}}
        ul.list-product(v-if="second_category_code" ref="productList")
          li.item-product(v-for="product in products" v-if="second_category_code&&product.T_order_store_good_category.includes(second_category_code)" v-on:click="selectProduct(product)")
            .name {{product.T_order_store_good_display_name}}
            .price {{product.T_order_store_good_defualt_price}}원
      .right
        ul.select-product-list(v-if="show_select_products" ref="selectProductList")
          li.select-product-item(v-for="select_product in select_products_sorted")
            .button.button-plus(v-on:click="plusQtyProduct(select_product)") +
            .info
              .info-top
                .name {{select_product.product.T_order_store_good_display_name}}
                .qty {{select_product.qty}}개
              .info-bottom
                .price {{select_product.product.T_order_store_good_defualt_price}}원
                .qty-price {{select_product.qty * select_product.product.T_order_store_good_defualt_price}}원
            .button.button-minus(v-on:click="minusQtyProduct(select_product)") -
    .foot
      .buttons
        .button(v-on:click="close") 닫기
        .button.button-red(v-on:click="submit")
          .info {{select_products_length}}가지 {{select_products_qty}}개 {{select_products_price}}원
          .text 주문하기
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      show: false,
      table: {},
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
    }
  },
  computed: {
    totalPrice() {
      let result = 0;
      return result;
    },
    selectProducts() {
      return this.select_products;
    },
    categorys() {
      return this.$store.getters.categorys;
    },
    products() {
      return this.$store.getters.products;
    },
    sortedCart() {
    }
  },
  methods: {
    submit() {
      let auth = this.$store.getters.auth;
      let store_shop_code = auth.store.code;
      let tablet_number = this.table.code;
      let store_good_code = [];
      let store_good_qty = [];

      //console.log(this.table);
      //console.log('auth', auth);
      

      let frm = new FormData();
      frm.set('store_shop_code', store_shop_code);
      frm.set('tablet_number', tablet_number);
      for (let code in this.select_products) {
        let item = this.select_products[code];
        let code = item.product.T_order_store_good_code;
        let qty = item.qty;

        store_good_code.push(code);
        store_good_qty.push(qty);
        frm.append('store_good_code[]', code);
        frm.append('store_good_qty[]', qty);
      }
      axios
      .post('http://rest.torder.co.kr/shop/order', frm)
      .then(function(res) {
        console.log(res);
        this.close();
      }.bind(this)).catch(function(err) {
        console.log({err: err});
      }).finally(function () {
      });
    },
    openTableOrders(table) {
      this.$eventBus.$emit('openTableOrders', table);
      this.close();
    },
    plusQtyProduct(select_product) {
      select_product.qty += 1;
      this.updateCart();
      this.show_select_products = false;
      this.show_select_products = true;
    },
    minusQtyProduct(select_product) {
      select_product.qty -= 1;

      if (select_product.qty < 1) {
        let code = select_product.product.T_order_store_good_code;
        delete this.select_products[code];
      }

      this.updateCart();
      this.show_select_products = false;
      this.show_select_products = true;
    },
    selectFirstCategory(category) {
      let code = category.T_order_store_menu_code;
      this.first_category = category;
      this.first_category_code = code;

      for (let code in this.$store.getters.categorys) {
        let category = this.$store.getters.categorys[code];

        if (category.T_order_store_menu_serviceUse==0
        && category.T_order_store_menu_depth.includes(this.first_category_code)
        && category.T_order_store_menu_use=='Y') {
          this.selectSecondCategory(category)
          break;
        }
      }
      this.$nextTick(() => {
        this.$refs.secondCategoryList.scrollTop = 0;
      });
    },
    selectSecondCategory(category) {
      let code = category.T_order_store_menu_code;
      this.second_category = category;
      this.second_category_code = code;

      this.$nextTick(() => {
        this.$refs.productList.scrollTop = 0;
      });
    },
    updateCart() {
      this.select_products_length = Object.keys(this.select_products).length;

      let price = 0;
      let qty = 0;
      for (let key in this.select_products) {
        let select_product = this.select_products[key];
        price += select_product.qty * select_product.product.T_order_store_good_defualt_price
        qty += select_product.qty;
      }

      this.select_products_qty = qty;
      this.select_products_price = price;

      let keys = Object.keys(this.select_products).sort(function(a, b) {
        return this.select_products[b].time - this.select_products[a].time;

      }.bind(this));

      this.select_products_sorted = [];
      for (let code of keys) {
        this.select_products_sorted.push(this.select_products[code])
      }

    },
    selectProduct(product) {
      let code = product.T_order_store_good_code;
      let current_time = Date.now();

      if (this.select_products.hasOwnProperty(code))  {
        this.select_products[code].qty += 1
        this.select_products[code].time = current_time;
      } else {
        this.select_products[code] = {
          product: product,
          qty: 1,
          time: current_time,
        }
        //this.set(this.select_products, code, product);
        //this.set(this.select_products[code], 'qty', 1);
      } 


      this.updateCart();
      this.show_select_products = false;
      this.show_select_products = true;
    },
    open(table) {
      this.table = table;
      for (let code in this.$store.getters.categorys) {
        let category = this.$store.getters.categorys[code];

        if (category.T_order_store_menu_serviceUse==0
        && category.T_order_store_menu_depth.includes('1')
        && category.T_order_store_menu_use=='Y') {
          this.first_category = category;
          this.first_category_code = code;

          let first_code = code;
          for (let code in this.$store.getters.categorys) {
            let category = this.$store.getters.categorys[code];

            if (category.T_order_store_menu_serviceUse==0
            && category.T_order_store_menu_depth.includes(first_code)
            && category.T_order_store_menu_use=='Y') {
              this.second_category = category;
              this.second_category_code = code;
              break;
            }
          }
          break;
        }
      }
      this.show = true;
    },
    close() {
      this.show = false;
      this.first_category= undefined;
      this.first_category_code= undefined;
      this.second_category= undefined;
      this.second_category_code= undefined;
      this.select_products= {};
      this.select_products_length = 0;
      this.select_products_qty = 0;
      this.select_products_price = 0;
      this.select_products_sorted = [];
    },
  },
  created() {
    this.$eventBus.$off('openMenuBoard');
    this.$eventBus.$on('openMenuBoard', this.open);
    this.$eventBus.$off('closeMenuBoard');
    this.$eventBus.$on('closeMenuBoard', this.close);
  },
  mounted() {

  },
}
</script>
<style lang="scss">
@import "./scss/global.scss";
#menuBoard {
  @include modal;
  .container {
    > .top {
    }
    > .body {
      > .left {
        width:70%;
        overflow:scroll;

        .list-category {
          display:flex;
          width:25%;
          flex-shrink:0;
          flex-direction:column;
          margin:0;
          padding:0;
          overflow:scroll;
        
          .item-category {
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

                .price {
                }
                .qty-price {
                }
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
