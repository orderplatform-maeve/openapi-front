import { TabletMenuSwitches } from '@widget/tablet-menu-switches/TabletMenuSwitches.tsx';
import { StoreMenuButtons } from '@widget/store-menu-buttons/StoreMenuButtons';
import { ReloadButton } from '@widget/reload-button/ReloadButton.tsx';
import { Logo } from '@widget/logo/Logo';
import { Clock } from '@widget/clock/Clock';
import styles from './Menu.module.css';

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
