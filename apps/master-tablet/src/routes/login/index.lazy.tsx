import { useState, useRef, type FormEvent } from 'react';
import { overlay } from 'overlay-kit';
import { useLoginApi, AxiosLoginResponse } from '@torder/client-fetcher/src/rest';
import { createLazyFileRoute, useRouter } from '@tanstack/react-router';
import styles from './index.module.css';
import { Input } from '@ui/Input';
import { AlertDialog } from '@ui/Dialog';
import { Button } from '@ui/Button';

export const Route = createLazyFileRoute('/login/')({
  component: () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();
    const { mutate } = useLoginApi({ onSuccess: onLoginSuccess });

    function onLoginSuccess(response: AxiosLoginResponse) {
      if (!response.data.result) {
        setAlertOpen(true);
        overlay.open(({ isOpen, close }) => {
          const onAlertDialogClose = () => {
            setAlertOpen(false);
            close();
          };
          return (
            <AlertDialog
              isOpen={isOpen}
              title="로그인 실패"
              text="태블릿 아이디와 비밀번호를 확인해주세요."
              close={onAlertDialogClose}
            />
          );
        });
        return;
      }

      const { member_data, token } = response.data;
      const member = {
        code: member_data.member_id,
        name: member_data.member_name,
      };
      window.localStorage.setItem('auth', JSON.stringify({ member }));
      if (token) {
        window.localStorage.setItem('token', token);
      }
      return router.navigate({ to: '/store' });
    }

    function onSubmit(e: FormEvent<HTMLFormElement>) {
      e.preventDefault();
      mutate({ member_id: id, member_pwd: password });
    }

    function handleClick() {
      if (formRef && formRef.current) {
        formRef.current.dispatchEvent(new Event('submit'));
      }
    }
    return (
      <form className={styles.container} ref={formRef} onSubmit={onSubmit}>
        <div>로그인을 해주세요</div>
        <Input name="id" placeholder="아이디" value={id} onChange={setId} />
        <Input name="passwod" type="password" placeholder="비밀번호" value={password} onChange={setPassword} />
        <Button type="submit" color="primary" block={true} disabled={alertOpen} onClick={handleClick}>
          로그인하기
        </Button>
      </form>
    );
  },
});
