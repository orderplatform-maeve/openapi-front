import { createLazyFileRoute } from '@tanstack/react-router';
import styles from './index.module.css';
import { Tabs, Tab, TabWindow } from '@ui/Tabs';

export const Route = createLazyFileRoute('/notice/')({
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
              <span className={styles.tabText}>전체</span>
            </Tab>
            <Tab>
              <span className={styles.tabText}>공지사항</span>
            </Tab>
            <Tab>
              <span className={styles.tabText}>업데이트</span>
            </Tab>
            <Tab>
              <span className={styles.tabText}>이벤트</span>
            </Tab>
            <Tab>
              <span className={styles.tabText}>뉴스</span>
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
