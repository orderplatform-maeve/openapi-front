import { ReactNode } from 'react';
import styles from './Card.module.css';

export interface CardTextProps {
  children: ReactNode;
}

export const CardText = ({ children }: CardTextProps) => <p className={styles.text}>{children}</p>;
