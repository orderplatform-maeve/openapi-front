import { ReactNode } from 'react';
import styles from './Card.module.css';

export interface CardSubTitleProps {
  children: ReactNode;
}

export const CardSubTitle = ({ children }: CardSubTitleProps) => <h3 className={styles.sub}>{children}</h3>;
