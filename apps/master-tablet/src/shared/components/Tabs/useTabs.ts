import { useState, useCallback } from 'react';

export const useTabs = (initialTabIndex = 0) => {
  const [currentTabIndex, setCurrentTabIndex] = useState(initialTabIndex);

  const setActiveTabIndex = useCallback((index: number) => {
    setCurrentTabIndex(index);
  }, []);
  return {
    currentTabIndex,
    setActiveTabIndex,
  };
};
