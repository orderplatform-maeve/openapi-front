import { NoticeCategory } from '@/features/notice/types/notice.ts';

export const TAB_CONFIG = {
  ALL: 0,
  NOTICE: 1,
  UPDATE: 2,
  EVENT: 3,
  NEWS: 4,
};

export const CATEGORY_INFO = {
  [TAB_CONFIG.ALL]: { key: null, label: '전체' },
  [TAB_CONFIG.NOTICE]: { key: 'NOTICE', label: '공지사항' },
  [TAB_CONFIG.UPDATE]: { key: 'UPDATE', label: '업데이트' },
  [TAB_CONFIG.EVENT]: { key: 'EVENT', label: '이벤트' },
  [TAB_CONFIG.NEWS]: { key: 'NEWS', label: '뉴스' },
} as const;

export const CATEGORY_MAPPING = Object.fromEntries(
  Object.entries(CATEGORY_INFO).map(([tab, info]) => [tab, info.key]),
) as Record<number, NoticeCategory | null>;
