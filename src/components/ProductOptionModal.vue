<template lang="pug">
  .product-option-modal-container(v-if="show")
    .wrap-product-option-modal
      .product-option-modal-title {{ product.displayNameOneLine }} 선택 옵션
      .wrap-product-option
        .product-option-category-list
          div(
            v-for="(group, index) in product.options"
            :key="group.index"
            :class="getCategoryStyle(index)"
            @click="selectIndex(index)"
          )
            p.product-option-category-number {{index+1}}
            p.product-option-category-name {{group.name}}
            p.product-option-require {{getRequireFlag(group.require_flag)}}
        .product-option-list
          p.option-max-select {{currentOption.limit_select}}개 까지 선택할 수 있어요.
          .product-option-information
            div(
              v-if="!currentOption.require_flag"
              :class="getOptionStyle(currentOption, true)"
              @click="selectNone(currentOption)"
            ) 선택안함
            div(
              v-for="(option, index) in currentOption.option_items"
              :key="`${currentIndex}-${index}`"
              :class="getOptionStyle(option, false)"
              @click="select(option)"
            )
              p.product-option-name {{option.name}}
              p.product-option-price + {{option.price.toLocaleString()}}원
        .product-option-cart
          .wrap-option-cart-list
            .option-cart-header
              p.product-option-cart-title {{product.displayNameOneLine}}
              button.cart-reset-button(@click="empty()") 초기화
            .option-cart-list
              .wrap-product-default-price
                p.text 기본가격
                p.product-default-price {{product.price.toLocaleString()}}원
              .wrap-cart-product-information(
                  v-for="option in reversedSelectedOptions"
                  v-bind:key="option.code + ':' + option.group.index"
                )
                .wrap-cart-product-option-name
                  p.cart-product-option-name {{option.displayname}}
                  p.cart-product-option-price {{option.price.toLocaleString()}}원
                .wrap-set-cart-product-option-qty(v-if="option.limit_qty!=1")
                  .cart-product-option-set-qty-button
                    icon-plus-button(:clickEvent="() => plusQty(option)")
                    p.cart-option-qty {{option.qty}}개
                    icon-minus-button(:clickEvent="() => minusQty(option)")
                  .cart-option-category {{option.group.name}}
            .wrap-confirm-button
              button.close(@click="close()") 닫기
              button.confirm(@click="submit") 주문 목록에 담기
              
</template>

<script>
export default {
  name: "ProductOptionModal",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    product: {
      type: Object,
      default() {
        return {
          index: 0,
        };
      },
    },
    close: {
      type: Function,
      default: () => {},
    },
    onSubmit: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      currentIndex: 0,
      selectedOptions: [],
    };
  },
  computed: {
    reversedSelectedOptions() {
      return this.selectedOptions.slice(0).reverse();
    },
    currentOption() {
      return this.product.options[this.currentIndex];
    }
  },
  methods: {
    selectIndex(index) {
      this.currentIndex = index;
    },
    getOptionStyle(option, selected) {
      return {
        'product-option': true,
        'selected': selected ? this.currentOption.noOption == true : option.qty > 0,
      };
    },
    getRequireFlag(status) {
      return status ? '*필수' : '';
    },
    getCategoryStyle(index) {
      return {
        'product-option-category': true,
        'selectCategory': this.currentIndex === index
      };
    },
    empty() {
      for (let g of this.product.options) {
        g.option_items.map((o) => {
          o.qty = 0;
          o.group.selected_count = 0;
        });
      }
      this.selectedOptions = [];
      this.$store.commit('pushFlashMessage', '전체 삭제 하였습니다.');
    },
    submit() {
      let flag = true;

      for (let g of this.product.options) {
        if (parseInt(g.require_flag) && g.selected_count < 1) {
          let msg =  '필수 항목 "' + g.name + '" 선택해 주세요.';
          this.$store.commit('pushFlashMessage', msg);
          flag = false;
        }
      }

      if (flag) {
        const sortedOptions = this.selectedOptions.sort((a, b) => {
          return a.group.sort_number - b.group.sort_number;
        });


        const optionProducts = sortedOptions.map((o) => {
          return {
            option: o,
            qty: o.qty,
          };
        });

        const currentOption = optionProducts.map((o) => ({
          pos_code: o.option.code,
          pos_name: o.option.name,
          good_code: o.option.code,
          order_qty: o.qty,
          pos_price: o.option.price,
          good_price: o.option.price,
          display_name: o.option.T_order_store_good_display_name,
        }));

        const processProdct = (good) => ({
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
        });

        const rednerOrder = {
          ...processProdct(this.product),
          qty: 1,
          option: currentOption,
        };
        
        const code = [this.product.code].concat(Array.from(sortedOptions, o => o.code +':' + o.qty)).join('-');

        const newOrder = {
          ...rednerOrder,
          good_code: code,
          order_qty: 1,
        };

        this.onSubmit(newOrder);
      }
    },
    select(option) {
      option.group.noOption = false;

      if (option.qty > 0) {
        option.qty = 0;

        this.popOption(option);
      } else {

        if (option.group.limit_select ==  1) {
          this.selectedOptions = this.selectedOptions.filter((o) => {
            if (o.group.index == option.group.index) {
              o.qty = 0;
            } else {
              return true;
            }
          });
          option.group.selected_count = 0;
        }

        if (option.group.selected_count < option.group.limit_select) {
          option.qty = 1;

          this.selectedOptions.push(option);
          option.group.selected_count += 1;

          this.$store.commit('pushFlashMessage', '"'+ option.group.name + ' - ' + option.name + '" 선택 하였습니다.');
        } else {
          this.$store.commit('pushFlashMessage', '"'+ option.group.name + '" ' + option.group.limit_select + '개 까지 선택할 수 있어요.');
        }
      }
    },
    selectNone(group) {
      if (group.noOption === true) {
        group.noOption = false;
      } else {
        group.noOption = true;

        group.option_items.map((option) => {
          this.popOption(option);
        });
      }
    },
    popOption(option) {
      let index = this.selectedOptions.findIndex((o) => {
        return o.code + ':' + o.group.index == option.code+ ':' + option.group.index;
      });

      if (index > -1) {
        this.selectedOptions.splice(index, 1);
        option.qty = 0;
        option.group.selected_count -= 1;

        if (option.group.selected_count < 0) {
          option.group.selected_count = 0;
        }

        this.$store.commit('pushFlashMessage', '"' + option.group.name + ' - ' + option.name + '" 삭제 하였습니다.');
      }
    },
    plusQty(option) {
      let max_qty = 9;
      if (option.limit_qty) {
        max_qty = option.limit_qty;
      }

      if (option.qty < max_qty) {
        option.qty += 1;
      } else {
        this.$store.commit('pushFlashMessage', '더 이상 추가할 수 없어요.');
      }
    },
    minusQty(option) {
      option.qty -= 1;
      if (option.qty < 1) {
        this.popOption(option);
      }
    },
  },
  mounted() {
  }
};
</script>

<style lang="scss" scoped>
.product-option-modal-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;

  .wrap-product-option-modal {
    width: 83.75vw;
    height: 76vh;
    background-color: #fff;
    border-radius: 1.5625vw;

    .product-option-modal-title {
      font-family: "notosans";
      font-size: 2.1875vw;
      padding: 1.796875vw 0 0.9375vw 3.125vw !important;
      border-bottom: solid 0.15625vw #fc0000;
      box-sizing: border-box;
    }

    .wrap-product-option {
      display: flex;

      .product-option-category-list {
        width: 21.25vw;
        height: calc(76vh - 6.09375vw);
        display: flex;
        flex-direction: column;
        gap: 0.78125vw;
        padding: 1.5625vw 2.34375vw !important;
        box-sizing: border-box;
        border-right: solid 0.078125vw #999;
        overflow: auto;

        .product-option-category {
          font-family: 'Spoqa Han Sans Neo', 'sans-serif';
          font-size: 1.5625vw;
          display: flex;
          align-items: center;
          gap: 0.78125vw;
          min-height: 5.234375vw;
          padding: 0 1.171875vw !important;
          border: solid 0.078125vw #d6d6d6;
          border-radius: 0.78125vw;
          box-sizing: border-box;
          background-color: #f5f5f5;

          .product-option-category-number {
            width: 2.5vw;
            height: 2.5vw;
            color: #666666;
            background-color: #e5e5e5;
            border-radius: 0.390625vw;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .product-option-category-name {
            flex: 1;
            letter-spacing: -0.0390625vw;
          }

          .product-option-require {
            width: 3.90625vw;
            color: #fc0000;
          }
        }

        .selectCategory {
          font-weight: bold;
          background-color: #fff;
          border: solid 0.15625vw #000;

          .product-option-category-number {
            color: #fff;
            background-color: #000;
          }
        }
      }
      
      .product-option-list {
        width: 31.25vw;
        height: calc(76vh - 6.59375vw);
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        padding: 1.5625vw 2.34375vw !important;
        box-sizing: border-box;
        border-right: solid 0.078125vw #999;
        overflow: auto;

        .option-max-select {
          font-family: "notosans";
          font-size: 1.40625vw;
          font-weight: bold;
          color: #fc0000;
          letter-spacing: -0.0703125vw;
        }

        .product-option-information {
          overflow: auto;
          margin-top: 0.78125vw !important;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0.390625vw;

          .product-option {
            height: 5.234375vw;
            font-size: 1.718750vw;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5625vw !important;
            background: #f5f5f5;
            border: solid 0.078125vw #d6d6d6;
            border-radius: 0.78125vw;
            box-sizing: border-box;

            .product-option-name {
              flex: 1;
              letter-spacing: -0.04296875vw;
            }

            .product-option-price {
              flex: 1;
              font-size: 1.5625vw;
              text-align: right;
            }
          }

          .selected {
            font-weight: bold;
            background-color: #fff;
            border: solid 0.15625vw #000;
          }
        }
      }

      .product-option-cart {
        flex: 1;
        .wrap-option-cart-list {
          padding: 0 2.34375vw !important;
          box-sizing: border-box;

          .option-cart-header {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 0.78125vw;
            padding: 1.5625vw 0 1.171875vw !important;
            border-bottom: solid 1px #999;

            .product-option-cart-title {
              flex: 1;
              font-family: "notosans";
              font-size: 1.5625vw;
              letter-spacing: -0.0390625vw;
            }

            .cart-reset-button {
              width: 6.25vw;
              height: 2.8125vw;
              font-family: 'Spoqa Han Sans Neo', 'sans-serif';
              font-size: 1.25vw;
              color: #fff;
              letter-spacing: -0.0625vw;
              background-color: #000;
              border-radius: 0.390625vw;
              border: none;
            }
          }

          .option-cart-list {
            display: flex;
            flex-direction: column;
            gap: 1.5625vw;
            height: calc(76vh - 17.8125vw);
            overflow: auto;
            padding: 1.328125vw 0 !important;
            box-sizing: border-box;


            .wrap-product-default-price {
              font-family: 'Spoqa Han Sans Neo', 'sans-serif';
              font-size: 1.5625vw;
              letter-spacing: -0.0625vw;
              display: flex;
              justify-content: space-between;
              align-items: center;
              box-sizing: border-box;

              .text {
                flex: 1;
              }

              .product-default-price {
                width: 6.953125vw;
                text-align: right;
              }
            }

            .wrap-cart-product-information {
              font-family: 'Spoqa Han Sans Neo', 'sans-serif';
              display: flex;
              flex-direction: column;
              gap: 0.78125vw;

              .wrap-cart-product-option-name {
                flex: 1;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 1.5625vw;
                letter-spacing: -0.0390625vw;

                .cart-product-option-name {
                  flex: 1;
                  font-weight: bold;
                }

                .cart-product-option-price {
                  width: 6.953125vw;
                  text-align: right;
                }
              }

              .wrap-set-cart-product-option-qty {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 0.78125vw;

                .cart-product-option-set-qty-button {
                  width: 10.625vw;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;

                  .cart-option-qty {
                    font-family: "notosans-medium";
                    font-size: 1.875vw;
                    letter-spacing: -0.09375vw;
                  }
                }

                .cart-option-category {
                  flex: 1;
                  font-family: 'Spoqa Han Sans Neo', 'sans-serif';
                  font-size: 1.25vw;
                  color: #666;
                  letter-spacing: -0.03125vw;
                }
              }
            }
          }

          .wrap-confirm-button {
            margin-top: 0.78125vw !important;
            display: flex;
            align-items: center;
            gap: 0.78125vw;

            > button {
              height: 4.53125vw;
              font-family: 'Spoqa Han Sans Neo', 'sans-serif';
              font-size: 2.03125vw;
              letter-spacing: -0.05078125vw;
              border: none;
              border-radius: 1.015625vw;
              color: #fff;
            }

            .close {
              width: 8.828125vw;
              background-color: #404144;
            }

            .confirm {
              flex: 1;
              font-weight: bold;
              background-color: #fc0000;
            }
          }
        }
      }
    }
  }
}
</style>
