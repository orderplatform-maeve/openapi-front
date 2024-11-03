import { useLayoutEffect, useEffect } from 'react';

/**
 * 서버사이드 렌더링(SSR)과 클라이언트 환경에서 모두 안전하게 동작하는 layoutEffect 훅
 *
 * - 브라우저 환경: React.useLayoutEffect 사용
 * - 서버 환경: React.useEffect 사용
 *
 * useLayoutEffect는 서버사이드 렌더링 시 경고를 발생시키므로,
 * 서버 환경에서는 useEffect로 대체하여 사용합니다.
 */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export { useIsomorphicLayoutEffect };
