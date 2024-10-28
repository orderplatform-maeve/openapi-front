import { PropsWithChildren } from 'react';
import styles from './Card.module.css';

export const CardAction = ({ children }: PropsWithChildren) => (
  <div className={styles.action}>{children}</div>
);
