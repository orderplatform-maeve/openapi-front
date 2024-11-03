import i18next, { InitOptions, i18n } from 'i18next';
import { I18nOptions } from './type';

// 지원하는 통화 타입 정의
type SupportedLocale = 'ko-KR' | 'en-US' | 'ja-JP' | 'zh-CN' | 'es-ES';

// 통화 설정
const CURRENCY_CONFIG = {
  'ko-KR': { currency: 'KRW', position: 'suffix', symbol: '원' },
  'en-US': { currency: 'USD', position: 'prefix', symbol: '$' },
  'ja-JP': { currency: 'JPY', position: 'prefix', symbol: '¥' },
  'zh-CN': { currency: 'CNY', position: 'prefix', symbol: '¥' },
  'zh-TW': { currency: 'CNY', position: 'prefix', symbol: '¥' },
  'es-ES': { currency: 'EUR', position: 'suffix', symbol: '€' },
} as const;

export interface CurrencyFormatOptions {
  force?: boolean;
  decimals?: number;
}

export interface I18nInstance extends i18n {
  fc: {
    (value: number, options?: { force?: boolean }): string;
    (key: string, value: number, options?: CurrencyFormatOptions): string;
  };
}

export class I18nCore {
  private i18n: I18nInstance;

  private initialLocale: string;

  constructor(private options: I18nOptions) {
    const instance = i18next.createInstance();
    this.initialLocale = options.defaultLocale;
    this.i18n = this.extendI18n(instance);
  }

  private formatCurrency(value: number, locale: string, decimals?: number): string {
    const config = CURRENCY_CONFIG[locale as SupportedLocale];

    if (!config) {
      return this.formatCurrency(value, this.initialLocale, decimals);
    }

    try {
      const formattedNumber = value.toLocaleString(locale, {
        minimumFractionDigits: decimals ?? 0,
        maximumFractionDigits: decimals ?? 0,
      });

      return config.position === 'prefix' ? `${config.symbol}${formattedNumber}` : `${formattedNumber}${config.symbol}`;
    } catch (error) {
      return `${value.toLocaleString()}${config.symbol}`;
    }
  }

  private extendI18n(instance: i18n): I18nInstance {
    const extended = instance as I18nInstance;

    const fc = (
      keyOrValue: string | number,
      valueOrOptions?: number | CurrencyFormatOptions,
      options?: CurrencyFormatOptions,
    ) => {
      // fc(value, options?) 형태로 호출된 경우
      if (typeof keyOrValue === 'number') {
        const opts = (valueOrOptions as CurrencyFormatOptions) ?? {};
        const locale = opts.force ? extended.language : this.initialLocale;
        return this.formatCurrency(keyOrValue, locale, opts.decimals);
      }

      // fc(key, value, options?) 형태로 호출된 경우
      const value = valueOrOptions as number;
      const opts = options ?? {};
      const locale = opts.force ? extended.language : this.initialLocale;
      const formattedValue = this.formatCurrency(value, locale, opts.decimals);

      return extended.t(keyOrValue, {
        formattedValue,
        value: formattedValue,
        count: value,
      });
    };

    extended.fc = fc as I18nInstance['fc'];
    return extended;
  }

  init(): I18nInstance {
    const i18nOptions: InitOptions = {
      lng: this.options.defaultLocale,
      fallbackLng: this.options.defaultLocale,
      supportedLngs: this.options.supportedLocales,
      interpolation: {
        escapeValue: false,
      },
      ...this.options,
    };

    this.i18n.init(i18nOptions);
    return this.i18n;
  }
}
