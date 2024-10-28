import type { BaseHTMLAttributes, ReactNode } from 'react';
import styles from './Tabs.module.css';

interface TabWindowProps extends BaseHTMLAttributes<HTMLBaseElement> {
  children: ReactNode;
}

export const TabWindow = (props: TabWindowProps) => {
  const { children } = props;
  return <div className={styles.container}>{children}</div>;
};
