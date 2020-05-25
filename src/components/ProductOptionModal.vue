<template lang="pug">
transition(name="modalFade")
  .md.md-product-option(v-if="show")
    .md-background
    .md-head
      .md-title {{ product.displayNameOneLine }} 선택 옵션
      .md-close-button(@click="close()") 닫기
    .md-body
      .column-option-group(ref='optionGroup')
        .option-group(v-for="group in product.options" v-bind:key="group.index" @mousedown.stop="scroll")
          .option-group-name {{ group.name }}
          .option-require(v-if="group.require_flag") * 필수 선택 사항입니다.
          .option-max-select {{ group.limit_select }}개 까지 선택할 수 있어요.
          .option-items
            .option-item.button(v-if="!group.require_flag" @click="selectNone(group)" v-bind:class="{selected: group.noOption == true}")
              .option-name 선택안함

            .option-item.button(v-for="option in group.option_items" @click="select(option)" v-bind:class="{selected: option.qty > 0}" )
              .option-name {{option.displayname}}
              .option-price(v-if="option.price>0") + {{option.price | numFormat}}원

      .column-product
        .product-name(v-html="product.displayNameOneLine")
        .product-default-price
          .label 기본 가격
          .price {{product.price | numFormat}}원
        .product-selected-option-list
          transition-group(name="selectedOption")
            .selected-option-item(v-for="option in reversedSelectedOptions" v-bind:key="option.code + ':' + option.group.index")
              .option-name
                .text {{option.displayname}}
                .group-name - {{option.group.name}}
              .line
                .option-qty(v-if="option.limit_qty!=1")
                  .button.button-plus(@click.stop="plusQty(option)") +
                  .number {{option.qty}} 개
                  .button.button-minus(@click.stop="minusQty(option)") -
                .option-qty(v-else)
                  .button.button-remove(@click.stop="popOption(option)") 삭제
                .option-price
                  span(v-if="option.price") {{option.price * option.qty | numFormat}} 원
        .buttons
          .button(@click="empty()") 전부 삭제
          .button.button-red(@click="submit") 주문 목록에 담기
</template>

<script>
export default {
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
      selectedOptions: [],
    };
  },
  computed: {
    reversedSelectedOptions() {
      return this.selectedOptions.slice(0).reverse();
    },
  },
  methods: {
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
    scroll(event) {
      const ele = event.target.closest('.option-group');
      const left = ele.offsetLeft;
      const wrapLeft = this.$refs.optionGroup.offsetLeft;

      const moveLeft = left - wrapLeft;
      this.$refs.optionGroup.scrollLeft = moveLeft;
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

        // // console.log(sortedOptions);

        const optionProducts = sortedOptions.map((o) => {
          return {
            ...this.$store.state.goods.find((p) => p.T_order_store_good_code === o.code),
            qty: o.qty,
          };
        });

        // // console.log('optionProducts', [...optionProducts]);

        const currentOption = optionProducts.map((o) => ({
          img_url: o.T_order_store_good_image,
          pos_code: o.T_order_store_pos_code,
          pos_name: o.T_order_store_good_name,
          cart_show: String(o.T_order_store_non_show_cart),
          good_code: o.T_order_store_good_code,
          order_qty: o.qty,
          pos_price: o.T_order_store_good_defualt_price,
          good_price: o.T_order_store_good_defualt_price,
          display_name: o.T_order_store_good_display_name,
        }));

        // // console.log('currentOption', [...currentOption]);

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
  }
};
</script>

<style lang="scss">
.md-product-option {
  display:flex;
  justify-content: center;
  z-index:19;
  position:fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  flex-direction: column;
  padding:0;
  color:#ffffff;

  .md-background {
    background-color: rgba(0, 0, 0, 0.8);
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: -1;
  }

  .md-head {
    display:flex;
    height:60px;
    margin:12px;
    flex-shrink:0;
    justify-content: space-between;

    .md-title {
      display:inline-block;
      flex-grow: 1;
      line-height:60px;
      padding:0;
      font-size:28px;
      font-weight:100;
      color:#ffffff;
      border-bottom:solid 1px #ffffff;
      margin-right:12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .md-close-button {
      display:flex;
      align-items: center;
      justify-content: center;
      padding:0 30px;
      font-size:20px;
      color:#000000;
      border: solid 1px #ffffff;
      border-radius:100px;
      height:60px;
      box-shadow: 0 0 8px -4px #000000;
      background-color:#ffffff;

      svg {
        margin-right:8px;
        width:auto;
        height:16px;

        * {
          fill: #000000;
        }
      }
    }
    .md-close-button:active {
      opacity:0.4;
    }
  }

  .md-body {
    display:flex;
    flex-direction:row;
    flex-grow: 1;
    overflow-y: auto;

    .column-option-group {
      scroll-behavior: smooth;
      display:flex;
      flex-grow:1;
      font-size:24px;
      line-height:1em;
      padding:0px;
      margin-right:-12px;
      overflow-x: scroll;
      border-radius:12px;
      z-index:1;
      color:#ffffff;
      font-weight:900;

      .option-group {
        display:flex;
        flex-direction:column;
        flex-grow:1;
        flex-shrink:0;
        padding:12px 24px;
        margin-right:0px;
        border-right: solid 1px #eaeaea;
        overflow-y: scroll;

        .option-group-name {
          display:flex;
          flex-shrink:0;
          font-size: 32px;
          line-height:1em;
          padding:12px 0px;
          border-bottom: solid 1px #ffffff;
          margin-bottom:12px;
        }
        .option-require {
          display:flex;
          flex-shrink:0;
          font-size: 20px;
          margin-bottom:12px;
          color:#ff0000;
        }
        .option-max-select {
          display:flex;
          flex-shrink:0;
          font-size: 20px;
          margin-bottom:12px;
        }
        .option-items {
          display:flex;
          flex-direction:column;

          .option-item {
            display:flex;
            flex-direction:row;
            flex-shrink:0;
            padding:0px 24px;
            align-items: center;
            justify-content: space-between;
            height:60px;
            margin-bottom:12px;
            border:solid 2px #ffffff;
            border-radius:100px;
            font-weight:100;

            .option-name {
              font-size:24px;

            }
            .option-price {
              display:flex;
              border-radius:100px;
              padding:0 12px;
              margin-left:8px;
              align-items: center;
              justify-content: center;
              font-size:16px;
              line-height:1em;
              height:28px;

              background-color:#ffffff;
              color:#202020;
            }
          }
          .option-item:last-child {
            margin-bottom:0;
          }
          .option-item.selected {
            background-color:#ffffff !important;
            color:#202020 !important;

            .option-price {
              background-color:#202020;
              color:#ffffff;
            }
          }
        }
      }
      .option-group:last-child {
        padding-right:32px;
        border-right:none;
      }
    }
    .column-product {
      display:flex;
      flex-direction:column;
      justify-content: center;
      align-items: center;
      background-color:#ffffff;
      border-radius:12px;
      color:#202020;
      flex-shrink:0;
      box-shadow: 0 0 8px -4px #000;
      z-index:2;

      width:30%;
      padding:12px 24px;
      font-size:24px;
      line-height:1em;

      > * {
        display:flex;
        width:100%;
      }

      .product-name {
        overflow:hidden;
        text-overflow:ellipsis;
        border-bottom: solid 1px #202020;
        font-size:32px;
        line-height:1em;
        padding:12px 0;
      }
      .product-default-price {
        justify-content: space-between;
        padding:12px 0;
      }

      .product-selected-option-list {
        flex-direction:column;
        flex-grow:1;
        overflow:scroll;

        .selected-option-item {
          display:flex;
          flex-direction:column;
          padding-top:12px;
          border-top:solid 1px #eaeaea;


          .option-name {
            display:flex;

            .text {
              display:inline;
            }
            .group-name  {
              display:inline;
              font-size:16px;
              margin-left:12px;
            }
          }

          .line {
            display:flex;
            flex-direction:row;
            justify-content: space-between;
            align-items: center;
            padding:12px 0;

          }
          .option-price {
            flex-grow:1;
            text-align: right;
          }

          .option-qty {
            display:flex;
            justify-content: center;
            align-items: center;

            .number {
              margin:0 24px;
            }
            .button {
              display:flex;
              height:40px;
              width:40px;
              font-size:24px;
              justify-content: center;
              align-items: center;
              background-color:#eaeaea;
              color:#202020;
              border-radius:100px;
              padding: 0;
            }
            .button-remove {
              padding:0 32px;
              font-size:16px;
            }
          }
        }
      }

      .buttons {
        display:flex;
        padding-top:12px;

        .button {
          display:flex;
          flex-grow:1;
          margin-right:12px;
          height:60px;
          background-color:#202020;
          color:#ffffff;
          border-radius:100px;
          justify-content: center;
          align-items: center;
          font-weight:900;
          font-size:20px;
        }
        .button:last-child {
          margin-right:0;
        }
        .button-red {
          width:40%;
          flex-shrink:0;
          background-color:#ff0000;
          color:#ffffff;
        }
      }
    }
  }
}

@keyframes selectedOptionOut {
  0% {
    opacity:0;
    transform: translateX(0);
  }
  100% {
    opacity:1;
    transform: translateX(100%);
  }
}
@keyframes selectedOptionIn {
  0% {
    opacity:0;
    transform: translateX(-100%);
  }
  100% {
    opacity:1;
    transform: translateX(0);
  }
}
.selectedOption-enter-active{
  animation: selectedOptionIn .5s;
}
.selectedOption-leave-active{
  animation: selectedOptionOut .5s;
}

.modalFade-enter-active{
  animation: fade .5s;

  .md-head {
    animation: mdHead .5s;
  }
  .md-body {
    animation: mdBody .5s;
  }
}

.modalFade-leave-active{
  animation: fade .5s reverse;

  .md-head {
    animation: mdHead .5s reverse;
  }
  .md-body {
    animation: mdBody .5s reverse;
  }

}

@keyframes fade {
  0% {
    opacity:0;
  }
  100% {
    opacity:1;
  }
}
@keyframes mdHead {
  0% {
    transform: translateY(-100vh);
  }
  100% {
    transform: translateY(0);
  }
}
@keyframes mdBody {
  0% {
    transform: translateY(100vh);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
