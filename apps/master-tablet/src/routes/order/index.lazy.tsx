import { createLazyFileRoute } from '@tanstack/react-router';
import styles from './index.module.css';
import { Tab, Tabs, TabWindow } from 'src/shared/components/Tabs';

export const Route = createLazyFileRoute('/order/')({
  component: () => {
    const onChangeTabIndex = (index: number) => {
      console.log(index);
    };
    return (
      <section className={styles.container}>
        <div className={styles.version}>v/2/0/46</div>
        <div className={styles['tabs-container']}>
          <Tabs initialTabIndex={0} onChangeTabIndex={onChangeTabIndex}>
            <Tab>
              <span className={styles['tab-text']}>모든 주문</span>
            </Tab>
            <Tab>
              <span className={styles['tab-text']}>미확인 주문</span>
            </Tab>
            <Tab>
              <span className={styles['tab-text']}>확인 주문</span>
            </Tab>
          </Tabs>
        </div>
        <div className={styles['tab-window-container']}>
          <TabWindow>
            <div className={styles['current-tab']}>
              <h1>컨텐츠</h1>
            </div>
          </TabWindow>
        </div>
      </section>
    );
  },
});
