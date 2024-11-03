import { inject, ref, Ref } from 'vue';

import { CurrencyFormatOptions } from '../core/i18n';
import { I18nInstance } from '../core';
import { I18nSymbol } from './provider';

type ExtractParams<T extends string> = T extends `${string}{${infer Param}}${infer Rest}`
  ? Param | ExtractParams<Rest>
  : never;

type IsNever<T> = [T] extends [never] ? true : false;

type TranslateFunction<MESSAGES extends Record<string, string>> = <K extends keyof MESSAGES>(
  key: K,
  ...args: IsNever<ExtractParams<MESSAGES[K]>> extends true
    ? []
    : [params: { [P in ExtractParams<MESSAGES[K]>]: string | number }]
) => MESSAGES[K];

type FormatCurrencyFunction = {
  (value: number, options?: CurrencyFormatOptions): string;
  (key: string, value: number, options?: CurrencyFormatOptions): string;
};

export function useI18n<MESSAGES extends Record<string, string>>() {
  const i18n = inject<Ref<I18nInstance>>(I18nSymbol);

  if (!i18n) {
    throw new Error('I18nProvider 내부에서 useI18n을 사용할 수 있어요.');
  }

  // 리렌더링을 트리거하기 위한 ref
  // TODO: I18n에서 제공하는 함수들을 구조 분해 할당으로 사용할 경우 반응성을 잃는 문제가 발생합니다.
  // 이 문제는 Vue 3.5 버전부터 개선되었으므로, 그 이전 버전에서는 아래와 같은 형태로 유지해야 합니다.
  const updateTrigger = ref(0);

  const events: Array<string> = ['languageChanged', 'loaded', 'added', 'removed'];

  events.forEach((event) => {
    i18n.value.on(event, () => {
      updateTrigger.value += 1;
    });
  });

  return {
    ...i18n.value,
    t: ((key: keyof MESSAGES, params?: Record<string, string | number>) => {
      const trigger = updateTrigger.value;
      return i18n.value.t(key as string, params as any);
    }) as unknown as TranslateFunction<MESSAGES>,
    language: () => i18n.value.language,
  } as unknown as {
    t: TranslateFunction<MESSAGES>;
    fc: FormatCurrencyFunction;
  } & Omit<I18nInstance, 't' | 'fc'>;
}
