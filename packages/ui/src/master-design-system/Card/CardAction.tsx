import { ReactNode } from 'react';
import styles from './Card.module.css';

export interface CardActionProps {
  children: ReactNode;
}

export const CardAction = ({ children }: CardActionProps) => <div className={styles.action}>{children}</div>;
