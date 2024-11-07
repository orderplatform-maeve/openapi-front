import styles from './Menu.module.css';
import { TabletMenuSwitches } from '@/features/tablet-menu-switches/TabletMenuSwitches.tsx';
import { StoreMenuButtons } from '@/features/store-menu-buttons/StoreMenuButtons.tsx';
import { ReloadButton } from '@/features/reload-button/ReloadButton.tsx';
import { Logo } from '@/features/logo/Logo.tsx';
import { Clock } from '@/features/clock/Clock.tsx';

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
