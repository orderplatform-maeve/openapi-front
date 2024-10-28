import { PropsWithChildren } from 'react';
import styles from './Card.module.css'; // 스타일을 위한 CSS 파일

export const CardTitle = ({ children }: PropsWithChildren) => (
  <h2 className={styles.title}>{children}</h2>
);
