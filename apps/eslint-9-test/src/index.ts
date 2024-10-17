import Person from './module.ts';

type Person = {
  name: string;
  age: number;
  address: string;
};

type Animal = {
  name: string;
  age: number;
  habitat: string;
};

type Life = Person & Animal;

const someone: Prettify<Life> = {
  name: 'deer',
  age: 123,
  address: 'korea',
  habitat: 'forest',
};

console.log(`someone = ${JSON.stringify(someone)}`);
