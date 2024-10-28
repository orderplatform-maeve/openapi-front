import { ReactNode } from 'react';
import styles from './Card.module.css'; // 스타일을 위한 CSS 파일

export interface CardTitleProps {
  children: ReactNode;
}

export const CardTitle = ({ children }: CardTitleProps) => <h2 className={styles.title}>{children}</h2>;
