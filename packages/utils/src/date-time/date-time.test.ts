import { expect, test } from 'vitest';
import { ko, enUS } from 'date-fns/locale';
import { getFormattedString } from './index';

test('yyyy-MM-dd 포맷을 정상적으로 변환한다.', () => {
  const date = new Date('2024-10-21');
  expect(getFormattedString(date, 'yyyy-MM-dd')).toBe('2024-10-21');
});

test('dd-MM-yy 포맷을 정상적으로 변환한다.', () => {
  const date = new Date('2024-10-21');
  expect(getFormattedString(date, 'dd-MM-yy')).toBe('21-10-24');
});

test('[한글] MMM dd, yyyy 포맷을 정상적으로 변환한다.', () => {
  const date = new Date('2024-10-21');
  expect(getFormattedString(date, 'yyyy년 MM월 dd일', { locale: ko })).toBe('2024년 10월 21일');
});

test('[영문] MMM dd, yyyy 포맷을 정상적으로 변환한다.', () => {
  const date = new Date('2024-10-21');
  expect(getFormattedString(date, 'MMM dd, yyyy', { locale: enUS })).toBe('Oct 21, 2024');
});
