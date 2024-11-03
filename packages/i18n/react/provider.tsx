import React, { createContext, useState } from 'react';
import { I18nCore, I18nInstance, I18nOptions } from '../core';
import { Hooks } from '@torder/utils';

const { useIsomorphicLayoutEffect } = Hooks;

export const I18nContext = createContext<I18nInstance | null>(null);

interface I18nProviderProps {
  options: I18nOptions;
  children: React.ReactNode;
}

export function I18nProvider({ options, children }: I18nProviderProps) {
  const [i18n, setI18n] = useState<I18nInstance | null>(null);

  useIsomorphicLayoutEffect(() => {
    const init = async () => {
      const i18nCore = new I18nCore(options);
      const instance = await i18nCore.init();
      setI18n(instance);
    };
    init();
  }, []);

  if (!i18n) {
    return null;
  }

  return <I18nContext.Provider value={i18n}>{children}</I18nContext.Provider>;
}
