export type Notice = {
  noticeId: number;
  noticeCategory: NoticeCategory;
  noticeTitle: string;
  author: string;
  createDate: string;
  topFix: number;
  newStatus: number;
  noticeFileStatus: number;
  noticeCheckStatus: number;
};

export type NoticeCategory = 'NOTICE' | 'UPDATE' | 'EVENT' | 'NEWS';
