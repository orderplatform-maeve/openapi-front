import { describe, expect, test } from 'vitest';
import { Client } from './';

describe('https://yesno.wtf', () => {
  test('/api 의 answer 는 yes 혹은 no 이다', async () => {
    const result = await Client.api();
    const data = result.data;
    expect(data.answer).oneOf(['yes', 'no']);
  });

  test('/api 의 응답이 200 이 수신되면 transformResponse 를 통해 data 의 message 에 "참 잘했어요"가 설정된다', async () => {
    const result = await Client.api();
    const data = result.data;
    expect(data.message).toBe('참 잘했어요');
  });
});
