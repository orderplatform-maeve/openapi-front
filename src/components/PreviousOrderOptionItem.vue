<template lang="pug">
.previous-order-product-option
  .previous-order-option-item
    p.last-option-name {{getBeforeProductOptionDisplayName(optionInfo)}}
    p.last-option-quantity {{getBeforeProductOptionOrderQty(optionInfo)}}개
  div(v-if="hasOptionChildren")
    PreviousOrderOptionItem(
      v-for="(childOptionList, index) in optionInfo.option"
      :key="getPreviousOptionItemKey(childOptionList, index)"
      :option-info="childOptionList"
    )
</template>

<script>
import utils from '@utils/orders.utils';

export default {
  name: 'PreviousOrderOptionItem',
  props: {
    optionInfo: {
      type: Object,
      required: true,
    },
    getPreviousOptionItemKey: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    ...utils,
    hasOptionChildren() {
      const { options } = this.optionInfo;
      return options && options?.length > 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.previous-order-product-option {
    display: flex;
    flex-direction: column;
    font-family: 'Spoqa Han Sans Neo', 'sans-serif';
    font-size: 1.015625vw;
    color: #aaa;

  .previous-order-option-item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .last-option-name {
      flex: 1;
    }

    .last-option-quantity {
      width: 3.125vw;
      text-align: right;
    }
  }
}

</style>
