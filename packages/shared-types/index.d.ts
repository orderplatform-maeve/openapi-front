declare global {
  /**
   * 합성 타입의 내부 속성을 쉽게 확인할 수 있는 유틸타입
   * type A = { name: string };
   * type B = { age: number };
   * type unionAB = A | B // -> 추론 결과: A | B
   * type unionAB2 = Prettier<A | B> // -> 추론 결과: { name: string, age: number };
   */
  type Prettify<T> = {
    [K in keyof T]: T[K];
  } & {};
}

export {};
