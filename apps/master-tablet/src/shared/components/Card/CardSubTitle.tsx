import { PropsWithChildren } from 'react';
import styles from './Card.module.css';

export const CardSubTitle = ({ children }: PropsWithChildren) => (
  <h3 className={styles.sub}>{children}</h3>
);
