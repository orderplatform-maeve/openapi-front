import { PropsWithChildren } from 'react';
import styles from './Card.module.css';

export const CardText = ({ children }: PropsWithChildren) => <div className={styles.text}>{children}</div>;
