import { defineComponent, PropType, provide, ref } from 'vue';
import { I18nCore, I18nInstance, I18nOptions } from '../core';

export const I18nSymbol = Symbol('I18n');

export const I18nProvider = defineComponent({
  name: 'I18nProvider',
  props: {
    options: {
      type: Object as PropType<I18nOptions>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const i18nCore = new I18nCore(props.options);
    const i18nInstance = ref<I18nInstance | null>(null);

    // i18next 인스턴스 초기화
    i18nInstance.value = i18nCore.init();

    provide(I18nSymbol, i18nInstance);

    return () => slots.default?.();
  },
});
