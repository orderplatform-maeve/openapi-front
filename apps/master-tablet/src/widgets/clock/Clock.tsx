import { useState, useEffect, useMemo } from 'react';
import { overlay } from 'overlay-kit';
import { DateTime } from '@torder/utils';
import { SecretModal } from '../modal/SecretModal.tsx';
import { LogoutModal } from '../modal/LogoutModal.tsx';
import styles from './Clock.module.css';

export const Clock = () => {
  const [time, setTime] = useState(new Date());
  const currentTime = useMemo(() => {
    // TODO: locale 적용
    return DateTime.getFormattedString(time, 'HH:mm:ss');
  }, [time]);
  const currentDate = useMemo<string>(() => {
    // TODO: locale 적용
    return DateTime.getFormattedString(time, 'MM월 dd일');
  }, [time]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 200);

    return () => clearInterval(intervalId);
  }, []);

  const onClickLogoutInSecret = () => {
    overlay.open(({ isOpen, close }) => {
      return <LogoutModal isOpen={isOpen} close={close} />;
    });
  };

  const onClickChangeStoreInSecret = () => {
    console.log('onClickChangeStoreInSecret');
  };

  const onMultipleTimesClick = () => {
    overlay.open(({ isOpen, close }) => {
      return (
        <SecretModal
          isOpen={isOpen}
          close={close}
          onClickLogout={onClickLogoutInSecret}
          onClickChangeStore={onClickChangeStoreInSecret}
        />
      );
    });
  };

  return (
    <section className={styles.container} onClick={onMultipleTimesClick}>
      <div className={styles.currentDate}>{currentDate}</div>
      <div className={styles.currentTime}>{currentTime}</div>
    </section>
  );
};
