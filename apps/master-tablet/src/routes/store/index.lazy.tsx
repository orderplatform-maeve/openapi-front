import { useStoreListApi } from '@torder/client-fetcher/src/rest/hooks/useStoreListApi.ts';
import { createLazyFileRoute, useRouter } from '@tanstack/react-router';
import styles from './index.module.css';
import { Button } from '@ui/Button';

type Auth = {
  member: {
    code: string;
    name: string;
  };
};

export const Route = createLazyFileRoute('/store/')({
  component: () => {
    const router = useRouter();
    const auth: Auth = JSON.parse(localStorage.getItem('auth') || '');
    const { member } = auth;
    if (!member) {
      return router.navigate({ to: '/login' });
    }
    const storeCode = member.code;
    const { isFetching, isFetched, data } = useStoreListApi(storeCode, {
      select: (data) => data.data,
    });

    const onClickOrderView = () => {
      return router.navigate({ to: '/order' });
    };

    return (
      <section className={styles.container}>
        <div>매장을 선택해주세요</div>
        {!isFetching && isFetched && (
          <ul className={styles.storeList}>
            {data?.shop_data.map((store) => (
              <li key={store.store_code} className={styles.storeListItem}>
                <div>{store.store_name}</div>
                <Button color="secondary" onClick={onClickOrderView}>
                  주문보기
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  },
});
