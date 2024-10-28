import styles from './TabletMenuSwitches.module.css';
import { Button } from '@ui/Button';

export const TabletMenuSwitches = () => {
  return (
    <section className={styles.container}>
      <div className={styles['switch-item']}>
        <p>태블릿 화면</p>
        <div className={styles['switch-buttons']}>
          <Button size="small">OFF</Button>
          <Button variant="filled" color="primary" size="small">
            ON
          </Button>
        </div>
      </div>
      <div className={styles['switch-item']}>
        <p>태블릿 주문</p>
        <div className={styles['switch-buttons']}>
          <Button size="small">OFF</Button>
          <Button variant="filled" color="primary" size="small">
            ON
          </Button>
        </div>
      </div>
      <div className={styles['switch-item']}>
        <p>주문 내역</p>
        <div className={styles['switch-buttons']}>
          <Button size="small">OFF</Button>
          <Button variant="filled" color="primary" size="small">
            ON
          </Button>
        </div>
      </div>
    </section>
  );
};
