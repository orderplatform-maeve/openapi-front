import type { BaseHTMLAttributes } from 'react';
import { Modal } from '@torder/ui/src/master-design-system/Modal';
import { IconClose, IconLogout } from '@torder/ui/src/master-design-system/Icons';
import { Card } from '@torder/ui/src/master-design-system/Card';
import { Button } from '@torder/ui/src/master-design-system/Button';

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
