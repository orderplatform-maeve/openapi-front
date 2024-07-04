<template lang="pug">
.product-option-list
  .product-option
    p.option-name {{getSecondOptionSymbol()}}{{getOptionDisplayName(optionInfo)}}
    .wrap-product-option-price
      p.option-quantity {{getOptionGoodQty(optionInfo)}}개
      p.option-price
        span(v-if="standardPriceFrontPosition") {{ standardPriceUnit }}
        span {{ getOptionPrice(optionInfo) }}
        span(v-if="!standardPriceFrontPosition") {{ standardPriceUnit }}
  div(v-if="hasOptionChildren")
    product-option-item(
      v-for="(childOptionList, index) in optionInfo.option"
      :key="getOptionItemKey(childOptionList, index)"
      :option-info="childOptionList"
      :standard-price-unit="standardPriceUnit"
      :standard-price-front-position="standardPriceFrontPosition"
    )
</template>

<script>
import utils from '@utils/orders.utils';
import { won } from "@utils/regularExpressions";

export default {
  name: 'ProductOptionItem',
  props: {
    optionInfo: {
      type: Object,
      required: true,
    },
    standardPriceUnit: {
      type: String,
    },
    standardPriceFrontPosition: {
      type: Boolean,
    },
    isFirstOption: {
      type: Boolean,
    },
    getOptionItemKey: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    ...utils,
    getOptionPrice(option) {
      if (!option) return 0;
      return won(option.good_price);
    },
    getSecondOptionSymbol() {
      if(!this.isFirstOption) return 'ㄴ';
      return '';
    },
    hasOptionChildren() {
      const { options } = this.optionInfo;
      return options && options?.length > 0;
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
      flex: 1;
      word-break: break-all;
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
