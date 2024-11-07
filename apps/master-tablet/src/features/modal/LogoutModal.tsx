import type { BaseHTMLAttributes } from 'react';
import { Modal } from '@ui/Modal';
import { IconClose, IconLogout } from '@ui/Icons';
import { Card } from '@ui/Card';
import { Button } from '@ui/Button';

interface LogoutModalProps extends BaseHTMLAttributes<HTMLBaseElement> {
  isOpen: boolean;
  close: () => void;
}

export const LogoutModal = (props: LogoutModalProps) => {
  const { isOpen, close } = props;
  const onClickCancel = () => {
    close();
  };
  const onClickLogout = () => {
    console.log('onClickLogout');
  };
  return (
    <Modal isOpen={isOpen} close={close}>
      <Card>
        <Card.Title>로그아웃</Card.Title>
        <Card.Text>로그아웃 하시겠어요?</Card.Text>
        <Card.Action>
          <Button variant={'text'} size={'medium'} onClick={onClickCancel}>
            <IconClose />
            <span>취소</span>
          </Button>
          <Button variant={'text'} color={'primary'} size={'medium'} onClick={onClickLogout}>
            <IconLogout />
            <span>로그아웃</span>
          </Button>
        </Card.Action>
      </Card>
    </Modal>
  );
};
