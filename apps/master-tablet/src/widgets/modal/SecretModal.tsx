import type { BaseHTMLAttributes } from 'react';
import { Modal } from '@torder/ui/src/master-design-system/Modal';
import { IconClose, IconLogout } from '@torder/ui/src/master-design-system/Icons';
import { Button } from '@torder/ui/src/master-design-system/Button';
import styles from './SecretModal.module.css';

interface SecretModalProps extends BaseHTMLAttributes<HTMLBaseElement> {
  isOpen: boolean;
  onClickLogout: () => void;
  onClickChangeStore: () => void;
  close: () => void;
}

export const SecretModal = (props: SecretModalProps) => {
  const { isOpen, close, onClickLogout, onClickChangeStore } = props;
  const onClickModalClose = () => {
    close();
  };
  return (
    <Modal isOpen={isOpen} close={close}>
      <div className={styles.container} onClick={close}>
        <div className={styles.header}>
          <Button color={'primary'} variant={'tonal'} stopPropagation={true} onClick={onClickModalClose}>
            <IconClose />
            <span>닫기</span>
          </Button>
        </div>
        <div className={styles.body}>
          <Button color={'primary'} variant={'tonal'} size={'large'} stopPropagation={true} onClick={onClickLogout}>
            <IconLogout />
            <span className={styles.buttonText}>로그아웃</span>
          </Button>
          <Button
            color={'primary'}
            variant={'tonal'}
            size={'large'}
            stopPropagation={true}
            onClick={onClickChangeStore}
          >
            <span className={styles.buttonText}>매장선택</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
