import { useContext, useEffect, useReducer } from 'react';
import { I18nContext } from './provider';
import { I18nInstance } from '../core';
import { CurrencyFormatOptions } from '../core/i18n';

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
  const i18n = useContext(I18nContext) as I18nInstance;
  if (!i18n) {
    throw new Error('useI18n must be used within an I18nProvider');
  }

  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const handleChange = () => forceUpdate();
  const events = ['languageChanged', 'loaded', 'added', 'removed'];

  useEffect(() => {
    // 이벤트 리스너 등록
    events.forEach((event) => i18n.on(event, handleChange));

    // 클린업 함수
    return () => {
      events.forEach((event) => i18n.off(event, handleChange));
    };
  }, [i18n]);

  return {
    ...i18n,
    t: ((key: keyof MESSAGES, params?: Record<string, string | number>) => {
      return i18n.t(key as string, params as any);
    }) as unknown as TranslateFunction<MESSAGES>,
  } as unknown as {
    t: TranslateFunction<MESSAGES>;
    fc: FormatCurrencyFunction;
  } & Omit<I18nInstance, 't' | 'fc'>;
}
