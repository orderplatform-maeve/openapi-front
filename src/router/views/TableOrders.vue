<template lang="pug">
  .table-orders-container
    modal-product-option(
      v-if="selectedProduct"
      :show="optionModal"
      :product="selectedProduct"
      :onSubmit="optionMdalConfirm"
      :close="optionModalClose"
    )
    .header
      p.table-number {{ getOrderTableNum() }}
      .wrap-order-information
        p.order-number 
          span.text 주문번호:
          span.value {{ getOrderId() }}
        p.customer-count 
          span.text 고객수:  
          span.value {{ getOrderCustomerCount() }}명
        p.order-date {{ getOrderTime() }}
    .wrap-product-list
      .main-categories
        .main-category(
          v-for="ctgItem in menu"
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
        .product-list-and-cart
          .scroll(@scroll="handleScroll" ref="scroll")
            .new-products(
              v-for="mainCtg in menu"
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
                  @click="() => selectGood(good)"
                )
                  p.new-product-good-name {{ good.displayName }}
                  p.new-product-good-price {{good.price.toLocaleString()}}원
          //- 이전주문내역
          .wrap-cart(v-if="cartStatus === 'previous'")
            .cart-header
              p.cart-title
                span.active 이전주문
                span.bar |
                span(@click="cartStatusChange") 장바구니
              .wrap-reset-button
                button.reset(@click="onDeleteOrder") 초기화
                button.refresh(@click="reload") 새로고침
            transition-group(name="cartEffect" tag="div").cart-product-list
              .cart-product(v-for="(order, orderIdx) in getReversePreviousOrders()" :class="getLastBorder(orderIdx)" :key="`previous-${orderIdx}`")
                .wrap-cart-product-name
                  p.cart-product-name {{ order.display_name }}
                  .wrap-cart-product-price
                    .cart-product-quantity {{ order.order_qty }}개
                    .cart-product-price {{ getPrice(order.good_price) }}원
                .wrap-cart-product-option(v-for="(option, index) in order.option" :key="`option-index:${index}`")
                  p.cart-product-option-name +{{option.display_name}}
                  .wrap-cart-product-option-price
                    .cart-product-option-quantity {{option.order_qty}}개
                    .cart-product-option-price {{option.pos_price.toLocaleString()}}원
            .cart-total-information
              p.cart-total-quantity {{ getPreviousOrderCount() }}건
              p.cart-total-price 
                span.text 합계: 
                span.price {{ getTotalPreviousOrder() }}원
            .wrap-confirm-button
              button.close-button(@click="close") 닫기
          //- 장바구니
          .wrap-cart(v-else)
            .cart-header
              p.cart-title
                span(@click="cartStatusChange") 이전주문
                span.bar |
                span.active 장바구니
              .wrap-reset-button
                button.reset(@click="onDeleteOrder") 초기화
                button.refresh(@click="reload") 새로고침
            transition-group(name="cartEffect" tag="div").cart-product-list
              .cart-product(v-for="(order, orderIdx) in getReverseCartList()" :class="getLastBorder(orderIdx)" :key="getCartListKey(orderIdx)")
                .wrap-cart-product-name
                  p.cart-product-name {{ order.display_name }}
                  .wrap-cart-product-price
                    .cart-product-quantity {{ order.order_qty }}개
                    .cart-product-price {{ getPrice(order.good_price) }}원
                .wrap-cart-product-option(v-for="(option, index) in order.option" :key="`option-index:${index}`")
                  p.cart-product-option-name +{{option.display_name}}
                  .wrap-cart-product-option-price
                    .cart-product-option-quantity {{option.order_qty}}개
                    .cart-product-option-price {{option.pos_price.toLocaleString()}}원
            .cart-total-information
              p.cart-total-quantity {{ getCartListOrderCount() }}건
              p.cart-total-price 
                span.text 합계: 
                span.price {{ getTotalCartList() }}원
            .wrap-confirm-button
              button.close-button(@click="close") 닫기
              button.submit-button(@click="yesOrder()") 주문하기
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
      timer: null,
      cartStatus: 'previous',
    };
  },
  computed: {
    previousOrders() {
      return this.$store.state.cartList;
    },
    getSelectMainCategoryItem() {
      return this.selectMainCategoryItem;
    },
    menu() {
      const { getCategoriesGoods } = this.$store.getters;
      return getCategoriesGoods;
    },
  },
  watch: {
    menu(newData) {

      if (!this.selectSubCategoryItem) {
        // console.log(newData[0].subCategories[0]);
        this.selectSubCategoryItem = newData[0]?.subCategories[0];
      }
    },
  },
  async mounted() {
    await this.getMenu();
    await this.getPreviousOrders();
    await this.getOrderData();
    this.emitTargetTable();
  },
  beforeRouteLeave(to, from, next) {
    if (this.$route?.params?.id) {
      const { store_code } = this.$store.state.auth.store;
      const payload = {
        store: {
          code: store_code,
        },
        type: '@request/ordering/location/table',
        tableId: this.$route.params.id,
        uCode: this.$store.state.uCode,
        MACAddr: this.$store.state.MACAddr,
        ordering: false,
      };

      this.$socket.emit('orderview', payload);
      next();
    }
  },
  destroyed() {
    this.$store.commit('SET_TABLE_CART_LIST', []);
    clearInterval(this.timer);
  },
  methods: {
    cartStatusChange() {
      if (this.cartStatus === 'previous') {
        this.cartStatus = 'cart';
      } else {
        this.cartStatus = 'previous';
      }
    },
    getCartListKey(index) {
      return `cart-${this.getReverseCartList().length - index}`;
    },
    getReversePreviousOrders() {
      const cartList = [...this.previousOrders].reverse();

      return cartList;
    },
    getReverseCartList() {
      const cartList = [...this.cartList].reverse();

      return cartList;
    },
    reload() {
      const { store_code } = this.$store.state.auth.store;
      const fd = new FormData();
      fd.append('store_code', store_code);
      fd.append('table_id', this.$route.params.id);

      this.$store.dispatch('tabletReload', fd);
    },
    getCategoryNameVisible(subCategory) {
      return subCategory.goods.length > 0;
    },
    close() {
      this.$router.replace(paths.tables);
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

      [...products].forEach((el) => {
        const elTop = el.offsetTop - this.$refs.scroll.offsetTop;
        if (elTop <= this.$refs.scroll.scrollTop) {

          const findItem = this.menu.find((o) => o.code === el.id);
          this.selectMainCategoryItem = findItem;
        }

        [...el.children].forEach((element) => {
          const subElTop = element.offsetTop;

          if (subElTop <= this.$refs.scroll.scrollTop) {
            const findSubItem = this.getSubCategories().find((o) => o.code === element.id);
            this.selectSubCategoryItem = findSubItem;
          }
        });
      });
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
    async getOrderData() { // table id로 테이블 정보 찾게 변경
      try {
        const { store_code } = this.$store.state.auth.store;
        const fd = new FormData();
        fd.append('shop_code', store_code);
        // fd.append('tablet_number', this.$route.params.id);

        const res = await this.$store.dispatch('setOrders', fd);
        const currentOrder = res.data.find((o) => o.table_number === this.$route.params.id);
        // // console.log('currentOrder', currentOrder);

        const parseOrder = JSON.parse(currentOrder.json_data);
        // // console.log(parseOrder);

        this.order = parseOrder;
      } catch (error) {
        // // console.log(error);
      }
    },
    async getMenu() {
      const fd = new FormData();
      const { store_code } = this.$store.state.auth.store;
      fd.append('store_code', store_code);

      const categories = await this.$store.dispatch('setCategories', fd);
      const goods = await this.$store.dispatch('setGoods', fd);
      // // console.log('categories', categories, goods);

      const noData = !categories || !goods;

      if (noData) return false;

      return true;
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
    async getPreviousOrders() {
      const fd = new FormData();
      const { store_code } = this.$store.state.auth.store;
      fd.append('store_code', store_code);
      fd.append('tablet_number', this.$route.params.id);

      const order = await this.$store.dispatch('setTableCartList', fd);

      // // console.log(orders);
      if (!order) return false;

      return true;
    },
    onSelectMainCtg(item) {
      this.selectMainCategoryItem = item;
      this.selectSubCategoryItem = item.subCategories[0];

      const elTop = this.$refs[item.code][0].offsetTop - this.$refs.scroll.offsetTop;
      this.$refs.scroll.scrollTo(0, elTop);
    },
    getActiveMainCategory(targetCode) {
      try {
        const { menu, getSelectMainCategoryItem } = this;

        if (!getSelectMainCategoryItem) {
          const isDefaultActive = targetCode === menu[0].code;
          if (isDefaultActive) {
            return 'active';
          }
          return '';
        }

        const isSelectedActive = getSelectMainCategoryItem.code === targetCode;
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

      const elTop = this.$refs[item.code][0].offsetTop - this.$refs.scroll.offsetTop;
      this.$refs.scroll.scrollTo(0, elTop);
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
        // console.log('options', this.selectedProduct);

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
        this.cartStatus = 'cartList';
        this.billScrollBottom();
      }
    },
    billScrollBottom() {
      setTimeout(() => {
        // this.$refs.billBody.scrollTo(0, this.$refs.billBody.scrollHeight);
        const cartProductList = document.querySelector('.cart-product-list');
        cartProductList.scrollTo(0, 0);
      }, 0);
    },
    async yesOrder() {
      try {
        if (this.cartList && this.cartList.length) {
          const config = { headers: { 'Content-Type': 'multipart/form-data' } };
          const fd = new FormData();
          const { store_code } = this.$store.state.auth.store;
          fd.append('store_shop_code', store_code);
          fd.append('tablet_number', this.$route.params.id);

          for (const [i, order] of this.cartList.entries()) {
            // console.log('order', order);
            fd.append('orders['+i+'][code]', order.good_code); // 주문 코드가 필요
            fd.append('orders['+i+'][qty]', order.order_qty);
          }

          const payload = {
            params: fd,
            config,
          };

          const res = this.$store.dispatch('yesOrder', payload);

          if (res) {
            if (!this.order) {
              await this.getOrderData();
            }
            // console.log('order', this.order);
            const newOrders = [...this.previousOrders, ...this.cartList];
            this.$socket.emit('orderview', {
              store: {
                code: store_code,
              },
              type: '@create/orders',
              orders: newOrders,
              order: this.order,
              cartList: this.cartList,
            });
            this.cartList = [];
          } else {
            this.$store.commit('pushFlashMessage', '주문 실패하였습니다.');
          }
        } else {
          this.$store.commit('pushFlashMessage', '새로운 주문이 없습니다.');
        }
      } catch (error) {
        this.$store.commit('pushFlashMessage', '주문 실패하였습니다.');
      }
    },
    optionModalClose() {
      setTimeout(() => {
        this.optionModal = false;
      }, 0);
    },
    optionMdalConfirm(newOrder) {
      // console.log('confirm', newOrder);
      this.cartList = [...this.cartList, newOrder];
      this.billScrollBottom();
      this.optionModalClose();
    },
    getPreviousOrderCount() {
      try {
        return this.previousOrders.length;
      } catch (error) {
        return 0;
      }
    },
    getCartListOrderCount() {
      try {
        return this.cartList.length;
      } catch (error) {
        return 0;
      }
    },
    getTotalCartList() {
      try {
        let total = 0;

        this.cartList.forEach((order) => {
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
    getTotalPreviousOrder() {
      try {
        let total = 0;

        this.previousOrders.forEach((order) => {
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
          last: true,
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
        // console.log(res);

        try {
          if (res.data) {
            this.$socket.emit('orderview', {
              store: {
                code: store_code,
              },
              type: '@reset/orders',
            });
            this.cartList = [];
          }
        } catch (error) {
          this.$store.commit('pushFlashMessage', '삭제가 실패 하였습니다.');
        }
      } catch (error) {
        this.$store.commit('pushFlashMessage', '주문이 이미 없습니다.');
      }
    },
    visibleDeleteButton() {
      // return process.env.UPLOAD_TYPE === 'tmp';
      return process.env.STOP_REDIRECT;
    },
    emitTargetTable() {
      if (this.$route?.params?.id) {
        const { store_code } = this.$store.state.auth.store;
        this.timer = setInterval(() => {
          // console.log('emitTargetTable', this.$route.params.id);
          const payload = {
            store: {
              code: store_code,
            },
            type: '@request/ordering/location/table',
            tableId: this.$route.params.id,
            uCode: this.$store.state.uCode,
            MACAddr: this.$store.state.MACAddr,
            ordering: true,
          };

          this.$socket.emit('orderview', payload);

        }, 1000);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.table-orders-container {
  width: 84.53125vw;
  font-family: 'Spoqa Han Sans Neo', 'sans-serif';

  .header {
    width: 84.53125vw;
    min-height: 6.25vw;
    padding: 1.25vw 3.125vw 1.25vw 0 !important;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;

    .table-number {
      flex: 1;
      font-size: 2.65625vw;
      font-weight: bold;
      letter-spacing: -0.03984375vw;
      color: #fc0000;
      overflow: auto;
    }

    .wrap-order-information {
      color: #fff;
      display: flex;
      align-items: center;
      gap: 3.125vw;

      .order-number,
      .customer-count {
        font-size: 1.5625vw;
        letter-spacing: -0.0234375vw;
        word-break: break-all;
        white-space: nowrap;
        
        .text {
          color: #ccc;
        }
        .value {
          color: #fff;
        }
      }

      .order-date {
        font-size: 1.5625vw;
        color: #fff;
        word-break: break-all;
        white-space: nowrap;
      }
    }
  }

  .wrap-product-list {
    display: flex;
    flex-direction: column;
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
        min-height: 7.03125vw;
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
        }

        .active {
          color: #fff;
          font-weight: bold;
          background-color: #000;
        }
      }
      .product-list-and-cart {
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
          padding-bottom: calc(100vh - 18.125vw) !important;
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
                  font-size: 1.71875vw;
                  color: #000;
                  font-weight: bold;
                }
                .new-product-good-price {
                  font-size: 1.5625vw;
                  color: #000;
                }
              }
            }
          }
          .new-products:first-child {
            margin-top: -2.34375vw !important;
          }
        }
        .scroll:last-child {
          padding-bottom: 50vh !important;
        }

        .wrap-cart {
          position: relative;
          width: 36.875vw;
          background-color: #1f222a;
          border-radius: 1.015625vw;
          padding: 0.78125vw 1.5625vw 1.5625vw !important;
          box-sizing: border-box;

          .cart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 0.78125vw !important;
            border-bottom: solid 0.078125vw #999;
            box-sizing: border-box;

            .cart-title {
              font-family: "notosans";
              font-size: 1.71875vw;
              font-weight: bold;
              letter-spacing: -0.04296875vw;
              color: #fff;
              display: flex;
              align-items: center;
              gap: 0.78125vw;

              .bar {
                font-family: 'Spoqa Han Sans Neo', 'sans-serif';
                color: #ccc;
              }

              .active {
                color: #fc0000;
              }
            }

            .wrap-reset-button {
              display: flex;
              align-items: center;
              gap: 0.78125vw;

              > button {
                width: 6.25vw;
                height: 2.8125vw;
                border-radius: 0.390625vw;
                border: none;
                background-color: #fff;
                font-family: 'Spoqa Han Sans Neo', 'sans-serif';
                font-size: 1.25vw;
                letter-spacing: -0.0625vw;
              }
            }
          }

          .cartEffect-enter-active {
            transition: all 1.5s;
          }
          .cartEffect-enter /* .list-leave-active below version 2.1.8 */ {
            background-color: #fc0000;
          }

          .cart-product-list {
            height: calc(100vh - 35vw);
            padding: 1.5625vw 0 !important;
            display: flex;
            flex-direction: column;
            gap: 1.171875vw;
            overflow: auto;
            border-bottom: solid 0.078125vw #999;
            box-sizing: border-box;

            .cart-product {
              .wrap-cart-product-name {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 0.78125vw;
                .cart-product-name {
                  flex: 1;
                  font-size: 1.40625vw;
                  font-weight: bold;
                  letter-spacing: -0.03515625vw;
                  color: #fff;
                }

                .wrap-cart-product-price {
                  display: flex;
                  align-items: center;
                  gap: 1.953125vw;
                  font-size: 1.40625vw;
                  letter-spacing: -0.03515625vw;
                  color: #fff;

                  .cart-product-price {
                    width: 8.203125vw;
                    text-align: right;
                  }
                }
              }

              .wrap-cart-product-option {
                padding-left: 0.78125vw !important;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 0.78125vw;
                box-sizing: border-box;
                color: #80a2ff;

                .cart-product-option-name {
                  font-size: 1.25vw;
                  letter-spacing: -0.03125vw;
                }

                .wrap-cart-product-option-price {
                  display: flex;
                  align-items: center;
                  gap: 1.953125vw;
                  font-size: 1.25vw;
                  letter-spacing: -0.03125vw;

                  .cart-product-option-price {
                    width: 8.203125vw;
                    text-align: right;
                  }
                }
              }
            }
          }

          .cart-total-information {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.171875vw 0 !important;

            .cart-total-quantity {
              font-size: 1.40625vw;
              letter-spacing: -0.03515625vw;
              color: #fff;
            }

            .cart-total-price {
              color: #fff;
              .text {
                font-size: 1.40625vw;
                letter-spacing: -0.03515625vw;
              }
              .price {
                font-size: 2.34375vw;
                font-weight: bold;
                letter-spacing: -0.05859375vw;
              }
            }
          }

          .wrap-confirm-button {
            display: flex;
            gap: 0.78125vw;

            > button {
              height: 4.53125vw;
              font-family: 'Spoqa Han Sans Neo', 'sans-serif';
              font-size: 2.03125vw;
              letter-spacing: -0.05078125vw;
              color: #fff;
              border: none;
              border-radius: 1.015625vw;
            }

            .close-button {
              width: 10.15625vw;
              background-color: #404144;
            }

            .submit-button {
              flex: 1;
              background-color: #fc0000;
            }
          }
        }
      }
    }
  }
}
</style>
