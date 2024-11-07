import { type ReactNode } from 'react';
import styles from './AlertDialog.module.css';
import { Modal } from '@ui/Modal';
import { Card } from '@ui/Card';
import { Button } from '@ui/Button';

interface DialogProps {
  isOpen: boolean;
  title: ReactNode;
  text?: ReactNode;
  close: () => void;
}

export const AlertDialog = (props: DialogProps) => {
  const { isOpen, close, title, text } = props;

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} close={close}>
      <Card>
        <Card.Title>
          <div className={styles.title}>{title}</div>
        </Card.Title>
        {text && (
          <Card.Text>
            <div className={styles.text}>{text}</div>
          </Card.Text>
        )}
        <Card.Action>
          <Button variant="text" color="secondary" size="medium" block onClick={close}>
            <span>확인</span>
          </Button>
        </Card.Action>
      </Card>
    </Modal>
  );
};
