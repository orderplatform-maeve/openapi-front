import { cloneElement, Children, type ReactElement, type BaseHTMLAttributes, isValidElement } from 'react';
import { useTabs } from './useTabs.ts';
import styles from './Tabs.module.css';
import { Tab, TabProps } from './Tab';

interface TabsProps extends BaseHTMLAttributes<HTMLBaseElement> {
  initialTabIndex?: number;
  onChangeTabIndex?: (index: number) => void;
}

export const Tabs = (props: TabsProps) => {
  const { children, initialTabIndex, onChangeTabIndex } = props;

  const { currentTabIndex, setActiveTabIndex } = useTabs(initialTabIndex || 0);

  const handleTabClick = (index: number) => {
    if (currentTabIndex !== index) {
      setActiveTabIndex(index);
      if (onChangeTabIndex) {
        onChangeTabIndex(index);
      }
    }
  };

  const tabs = Children.map(children, (child, index) => {
    if (!isValidElement(child)) {
      console.error('Unavailable child component');
      return null;
    }
    if (child.type !== Tab) {
      console.warn('Only <Tab /> component can be used inside <Tags />');
    }
    return cloneElement(child as ReactElement<TabProps>, {
      index,
      isActive: index === currentTabIndex,
      onClick: () => handleTabClick(index),
    });
  });

  return <section className={styles.container}>{tabs}</section>;
};
