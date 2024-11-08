import { NoticeCategory } from '@/features/notice/types/notice.ts';
import { CATEGORY_INFO } from '@/features/notice/constants/categories.ts';

export const getCategoryLabel = (category: NoticeCategory | null): string => {
  const categoryInfo = Object.values(CATEGORY_INFO).find((info) => info.key === category);
  return categoryInfo?.label || '전체';
};
