import { LinkButton } from '@torder/ui/src/master-design-system/Button';
import { useRouterState } from '@tanstack/react-router';

import styles from './StoreMenuButtons.module.css';

export const StoreMenuButtons = () => {
  const router = useRouterState();
  const path = router.location.pathname;
  return (
    <section className={styles.container}>
      <LinkButton size={'medium'} link={'/notice'} color={path === '/notice' ? 'primary' : 'basic'}>
        <span>공지사항</span>
      </LinkButton>
      <LinkButton size={'medium'} link={'/order'} color={path === '/order' ? 'primary' : 'basic'}>
        <span>주문보기</span>
      </LinkButton>
      <LinkButton size={'medium'} link={'/additional'} color={path === '/additional' ? 'primary' : 'basic'}>
        <span>추가기능</span>
      </LinkButton>
      <LinkButton size={'medium'} link={'/payment'} color={path === '/payment' ? 'primary' : 'basic'}>
        <span>결제내역</span>
      </LinkButton>
    </section>
  );
};
