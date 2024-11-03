# react-i18n

## 사용법

### 1. `I18nProvider`로 애플리케이션 감싸기

애플리케이션의 루트 컴포넌트를 I18nProvider로 감싸고, 국제화 옵션을 전달합니다.

```tsx
<I18nProvider options={i18nOptions}>
     <App />
</I18nProvider>
```

### 1-1. `i18nOptions`은 기본적으로 i18next의 명세를 따르고 있어요.

https://www.i18next.com/overview/api

### 2. `useI18n` 훅 사용하기

컴포넌트 내에서 useI18n 훅을 호출하여 번역 기능을 사용할 수 있습니다.

```tsx
import { useI18n } from './path/to/useI18n';

function MyComponent() {
  const { t } = useI18n<typeof messages>();
  
  return (
    <div>{t('hello')}</div> // messages 타입 에러 도출.
  );
}

export default MyComponent;
```
