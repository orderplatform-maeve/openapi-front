import { useState } from 'react';
import { useLoginApi, AxiosLoginResponse } from '@torder/client-fetcher/src/rest';
import { createLazyFileRoute, useRouter } from '@tanstack/react-router';
import styles from './index.module.css';
import { Input } from '@ui/Input';
import { Button } from '@ui/Button';

export const Route = createLazyFileRoute('/login/')({
  component: () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { mutate } = useLoginApi({ onSuccess: onLoginSuccess });

    function onLoginSuccess(response: AxiosLoginResponse) {
      if (!response.data.result) {
        return;
      }
      const { member_data, token } = response.data;
      const member = {
        code: member_data.member_id,
        name: member_data.member_name,
      };
      if (window.localStorage) {
        window.localStorage.setItem('auth', JSON.stringify({ member }));
        if (token) {
          window.localStorage.setItem('token', token);
        }
      }
      return router.navigate({ to: '/store' });
    }

    async function onSubmit() {
      mutate({ member_id: id, member_pwd: password });
    }
    return (
      <form className={styles.container}>
        <div>로그인을 해주세요</div>
        <Input name="id" placeholder="아이디" value={id} onChange={setId} />
        <Input name="passwod" type="password" placeholder="비밀번호" value={password} onChange={setPassword} />
        <Button type="submit" color="primary" block={true} preventDefault={true} onClick={onSubmit}>
          로그인하기
        </Button>
      </form>
    );
  },
});
