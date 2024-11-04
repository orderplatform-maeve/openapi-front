import { Primary as PrimaryButton } from '@torder/ui';
import styles from './index.module.css';

const Sample = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.primary}>Sample Component</h1>
      <PrimaryButton>@torder/ui Button</PrimaryButton>
    </div>
  );
};

export { Sample };
