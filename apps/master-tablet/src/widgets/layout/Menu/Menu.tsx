import styles from './Menu.module.css';
import { TabletMenuSwitches } from '@/widgets/tablet-menu-switches/TabletMenuSwitches.tsx';
import { StoreMenuButtons } from '@/widgets/store-menu-buttons/StoreMenuButtons';
import { ReloadButton } from '@/widgets/reload-button/ReloadButton.tsx';
import { Logo } from '@/widgets/logo/Logo';
import { Clock } from '@/widgets/clock/Clock';

export const Menu = () => {
  return (
    <section className={styles.container}>
      <div>
        <Logo />
        <Clock />
        <StoreMenuButtons />
      </div>
      <div>
        <TabletMenuSwitches />
        <ReloadButton />
      </div>
    </section>
  );
};
