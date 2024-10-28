import { PropsWithChildren } from 'react';
import styles from './Card.module.css';

export const CardText = ({ children }: PropsWithChildren) => <p className={styles.text}>{children}</p>;
