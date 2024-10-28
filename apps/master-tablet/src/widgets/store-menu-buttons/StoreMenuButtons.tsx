import { useRouterState } from '@tanstack/react-router';

import styles from './StoreMenuButtons.module.css';
import { LinkButton } from '@ui/Button';

export const StoreMenuButtons = () => {
  const router = useRouterState();
  const path = router.location.pathname;
  const basePath = path.split('/')[1];
  return (
    <section className={styles.container}>
      <LinkButton size={'medium'} link={'/notice'} color={basePath === 'notice' ? 'primary' : 'basic'}>
        <span>공지사항</span>
      </LinkButton>
      <LinkButton size={'medium'} link={'/order'} color={basePath === 'order' ? 'primary' : 'basic'}>
        <span>주문보기</span>
      </LinkButton>
      <LinkButton size={'medium'} link={'/additional'} color={basePath === 'additional' ? 'primary' : 'basic'}>
        <span>추가기능</span>
      </LinkButton>
      <LinkButton size={'medium'} link={'/payment'} color={basePath === 'payment' ? 'primary' : 'basic'}>
        <span>결제내역</span>
      </LinkButton>
    </section>
  );
};
