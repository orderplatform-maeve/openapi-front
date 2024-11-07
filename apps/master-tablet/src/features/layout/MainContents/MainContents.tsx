import { Outlet } from '@tanstack/react-router';
import styles from './MainContents.module.css';

export const MainContents = () => {
  return (
    <section className={styles.container}>
      <Outlet />
    </section>
  );
};
