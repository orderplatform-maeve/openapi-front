import { getCategoryLabel } from '@/utills/formatters.ts';
import { Notice } from '@/features/notice/types/notice.ts';

type NoticeTableBodyProps = {
  data: Notice[];
  onNoticeClick: (noticeId: number) => void;
};

export const TableBody = ({ data, onNoticeClick }: NoticeTableBodyProps) => {
  return (
    <tbody>
      {data.map((notice, index) => (
        <tr
          key={notice.noticeId}
          onClick={() => onNoticeClick(notice.noticeId)}
          className={`text-[1.4rem] border-b border-gray-100 hover:bg-gray-50 cursor-pointer font-bold
                ${notice.topFix ? 'bg-gray-50 font-semibold' : ''}
                ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              `}
        >
          <td className="p-4">
            {notice.topFix ? (
              <span className="text-base px-2 py-1 text-white bg-red-500 rounded-[0.9375vw]">공지</span>
            ) : (
              notice.noticeId
            )}
          </td>
          <td className="p-4">{getCategoryLabel(notice.noticeCategory)}</td>
          <td className="p-4 flex items-center gap-2">
            <span className="truncate">{notice.noticeTitle}</span>
            {notice.noticeFileStatus === 1 && <span className="text-blue-500">📎</span>}
            {notice.newStatus === 1 && <span className="px-1 py-0.5 text-xs text-white bg-blue-500 rounded">N</span>}
          </td>
          <td className="p-4">{notice.author}</td>
          <td className="p-4">{notice.createDate}</td>
        </tr>
      ))}
    </tbody>
  );
};
