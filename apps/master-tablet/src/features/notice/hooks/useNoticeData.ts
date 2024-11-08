import { useMemo } from 'react';
import { Notice } from '@/features/notice/types/notice.ts';
import { CATEGORY_MAPPING } from '@/features/notice/constants/categories.ts';

// TODO: API 연결 후 삭제 예정
export const useNoticeData = (data: Notice[], activeTab: number) => {
  return useMemo(() => {
    const category = CATEGORY_MAPPING[activeTab];
    if (!category) return data;
    return data.filter((notice) => notice.noticeCategory === category);
  }, [data, activeTab]);
};
