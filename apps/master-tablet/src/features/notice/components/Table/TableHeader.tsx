type TableHeader = {
  key: string;
  label: string;
  width: string;
};

type TableHeaderProps = {
  headers: TableHeader[];
};

export const TableHeader = ({ headers }: TableHeaderProps) => {
  return (
    <thead>
      <tr className="text-[1.4rem] border-b border-gray-200">
        {headers.map(({ key, label, width }) => (
          <th key={key} className={`p-4 text-center font-medium text-gray-600 text-left ${width}`}>
            {label}
          </th>
        ))}
      </tr>
    </thead>
  );
};
