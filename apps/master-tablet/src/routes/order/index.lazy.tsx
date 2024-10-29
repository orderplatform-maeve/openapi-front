import { createLazyFileRoute } from '@tanstack/react-router';
import styles from './index.module.css';
import { Tab, Tabs, TabWindow } from '@ui/Tabs';

export const Route = createLazyFileRoute('/order/')({
  component: () => {
    const onChangeTabIndex = (index: number) => {
      console.log(index);
    };
    return (
      <section className={styles.container}>
        <div className={styles.version}>v/2/0/46</div>
        <div className={styles.tabsContainer}>
          <Tabs initialTabIndex={0} onChangeTabIndex={onChangeTabIndex}>
            <Tab>
              <span className={styles.tabText}>모든 주문</span>
            </Tab>
            <Tab>
              <span className={styles.tabText}>미확인 주문</span>
            </Tab>
            <Tab>
              <span className={styles.tabText}>확인 주문</span>
            </Tab>
          </Tabs>
        </div>
        <div className={styles.tabWindowContainer}>
          <TabWindow>
            <div className={styles.currentTab}>
              <h1>컨텐츠</h1>
            </div>
          </TabWindow>
        </div>
      </section>
    );
  },
});
