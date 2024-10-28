import { IconReload } from '@torder/ui/src/master-design-system/Icons';
import { RightIconButton } from '@torder/ui/src/master-design-system/Button';
import styles from './ReloadButton.module.css';

export const ReloadButton = () => {
  return (
    <section className={styles.container}>
      <RightIconButton className={styles.reload} icon={IconReload()} variant={'text'}>
        새로고침
      </RightIconButton>
    </section>
  );
};
