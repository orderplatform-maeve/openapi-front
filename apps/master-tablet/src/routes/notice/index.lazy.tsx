import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@torder/ui';
import { createLazyFileRoute } from '@tanstack/react-router';
import styles from './index.module.css';
import { Notice } from '@/features/notice/types/notice.ts';
import { useNoticeData } from '@/features/notice/hooks/useNoticeData.ts';
import { TAB_CONFIG } from '@/features/notice/constants/categories.ts';
import { NoticeTable } from '@/features/notice/components/NoticeTable';

const MOCK_DATA: Notice[] = [
  {
    noticeId: 1,
    noticeCategory: 'NOTICE',
    noticeTitle: '공지사항 테스트',
    author: '관리자',
    createDate: '2024-04-01',
    topFix: 1,
    newStatus: 1,
    noticeFileStatus: 1,
    noticeCheckStatus: 1,
  },
  {
    noticeId: 2,
    noticeCategory: 'NEWS',
    noticeTitle: '뉴스 테스트',
    author: '관리자',
    createDate: '2024-10-01',
    topFix: 1,
    newStatus: 1,
    noticeFileStatus: 1,
    noticeCheckStatus: 1,
  },
];

// export type NoticeSearchParams = {
//   type: 'TITLE' | 'DESC';
//   query: string;
// };

export const Route = createLazyFileRoute('/notice/')({
  component: () => {
    const [activeTab] = useState(TAB_CONFIG.ALL);
    // TODO: search input 구현시 활성화
    // const [searchParams, setSearchParams] = useState<NoticeSearchParams>({
    //   type: 'TITLE',
    //   query: '',
    // });

    // TODO: API 연결 작업하면서 아래 주석과 같이 변경 예정
    const filteredData = useNoticeData(MOCK_DATA, activeTab);
    // const { data, loading } = useNotices({
    //   category: getTabCategory(activeTab),
    //   searchParams,
    // });

    const handleNoticeClick = () => {
      // navigate({ to: '/notice/$noticeId', params: { noticeId } });
      console.log('Goto notice detail page~');
    };

    // TODO: search input 구현시 활성화
    // const handleSearch = (params: NoticeSearchParams) => {
    //   setSearchParams(params);
    // };

    return (
      <section className={styles.container}>
        <div className={styles.version}>v/2/0/46</div>
        <div className={'w-full'}>
          <Tabs className="w-full max-w-3xl mx-auto">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="ALL">전체</TabsTrigger>
              <TabsTrigger value="NOTICE">공지사항</TabsTrigger>
              <TabsTrigger value="UPDATE">업데이트</TabsTrigger>
              <TabsTrigger value="EVENT">이벤트</TabsTrigger>
              <TabsTrigger value="NEWS">뉴스</TabsTrigger>
            </TabsList>
            <TabsContent value="NOTICE" className="bg-white w-full">
              <div className="p-4">공지사항</div>
              <NoticeTable data={filteredData} loading={false} onNoticeClick={handleNoticeClick} />
            </TabsContent>
            <TabsContent value="UPDATE" className="bg-white w-full">
              <div className="p-4">업데이트</div>
            </TabsContent>
            <TabsContent value="EVENT" className="bg-white w-full">
              <div className="p-4">이벤트</div>
            </TabsContent>
            <TabsContent value="NEWS" className="bg-white w-full">
              <div className="p-4">뉴스</div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    );
  },
});
