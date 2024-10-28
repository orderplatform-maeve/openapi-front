import React, { ReactNode } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  close: () => void;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, close, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // overlay dimmed 영역을 클릭할때 닫기
    if (e.target === e.currentTarget) {
      close();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      {children}
    </div>
  );
};
