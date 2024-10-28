import styles from './ReloadButton.module.css';
import { IconReload } from '@ui/Icons';
import { Button } from '@ui/Button';

export const ReloadButton = () => {
  return (
    <section className={styles.container}>
      <Button variant={'text'}>
        <div className={styles.reload}>
          새로고침
          <IconReload />
        </div>
      </Button>
    </section>
  );
};
