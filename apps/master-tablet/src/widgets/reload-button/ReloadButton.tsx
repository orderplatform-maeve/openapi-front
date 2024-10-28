import styles from './ReloadButton.module.css';
import { IconReload } from '@ui/Icons';
import { RightIconButton } from '@ui/Button';

export const ReloadButton = () => {
  return (
    <section className={styles.container}>
      <RightIconButton className={styles.reload} icon={IconReload()} variant={'text'}>
        새로고침
      </RightIconButton>
    </section>
  );
};
