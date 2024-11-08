import { Notice } from '@/features/notice/types/notice.ts';
import { TableBody, TableHeader } from '@/features/notice/components/Table';

type NoticeTableProps = {
  data: Notice[];
  loading: boolean;
  onNoticeClick: (noticeId: number) => void;
};

const TABLE_HEADERS = [
  { key: 'no', label: 'No', width: 'w-16' },
  { key: 'category', label: '구분', width: 'w-24' },
  { key: 'title', label: '제목', width: 'w-64' },
  { key: 'author', label: '작성자', width: 'w-32' },
  { key: 'date', label: '작성일', width: 'w-32' },
];

export const NoticeTable = ({ data, loading, onNoticeClick }: NoticeTableProps) => {
  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="w-full overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full border-collapse">
        <TableHeader headers={TABLE_HEADERS} />
        <TableBody data={data} onNoticeClick={onNoticeClick} />
      </table>
    </div>
  );
};
