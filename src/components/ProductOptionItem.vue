<template lang="pug">
div.product-option-list
  div.product-option
    p.option-name {{getFirstOptionSymbol()}}{{getOptionDisplayName(optionList)}}
    .wrap-product-option-price
      p.option-quantity {{getOptionGoodQty(optionList)}}개
      p.option-price
        span(v-if="standardPriceFrontPosition") {{ standardPriceUnit }}
        span {{ getOptionPrice(optionList) }}
        span(v-if="!standardPriceFrontPosition") {{ standardPriceUnit }}
  div(v-if="hasOptionChildren")
    product-option-item(v-for="childOptionList in optionList.options" :option-list="childOptionList")
</template>

<script>
import utils from '@utils/orders.utils';
import { won } from "@utils/regularExpressions";

export default {
  name: 'ProductOptionItem',
  props: {
    optionList: {
      type: Object,
    },
    standardPriceUnit: {
      type: String,
    },
    standardPriceFrontPosition: {
      type: Boolean,
    },
    isFirstOption: {
      type: Boolean,
    }
  },
  methods: {
    ...utils,
    getOptionPrice(option) {
      if (!option) return 0;
      return won(option.good_price);
    },
    getFirstOptionSymbol() {
      if(!this.isFirstOption) return 'ㄴ';
      return '';
    }
  },
  computed: {
    hasOptionChildren() {
      const { options } = this.optionList;
      return options && options.length > 0;
    },
  },
};
</script>

<style lang="scss" scoped>

.product-option-list {
  display: flex;
  flex-direction: column;

  .product-option {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .option-name {
      text-indent: 1em;
      flex: 1;
    }

    .wrap-product-option-price {
      width: 21.25vw;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.171875vw;

      .option-quantity {
        width: 7.96875vw;
        text-align: right;
      }

      .option-price {
        width: 12.109375vw;
        font-size: 1.5625vw;
        text-align: right;
      }
    }
  }
}

</style>
