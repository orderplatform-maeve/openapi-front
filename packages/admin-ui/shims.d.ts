import React from 'react';

declare global {
  /**
   * html element 의 props 를 가져오기 위한 유틸 타입
   * 예시) ElementProps<'button'>, ElementProps<'div'>
   */
  type ElementProps<T extends keyof React.JSX.IntrinsicElements> = React.JSX.IntrinsicElements[T];

  declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
  }
}

export {};
