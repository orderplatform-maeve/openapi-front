import { CATEGORY_MAPPING } from '@/features/notice/constants/categories.ts';

export type CategoryKey = keyof typeof CATEGORY_MAPPING;
export type CategoryValue = (typeof CATEGORY_MAPPING)[CategoryKey];
