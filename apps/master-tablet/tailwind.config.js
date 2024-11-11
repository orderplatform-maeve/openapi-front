import uiTailwindConfig from '@torder/ui/tailwind.config.js';

export default {
  ...uiTailwindConfig,
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    // ui 패키지의 컴포넌트 경로 추가
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
}

