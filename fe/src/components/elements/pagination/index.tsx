import { Pagination as PaginationAntd } from "antd";
export interface PaginationProps {
  pageSize?: number;
  total?: number;
  current?: number;
  onPageChange?: (page: number) => void;
}

export default function Pagination(props: PaginationProps) {
  return (
    <>
      <PaginationAntd
        pageSize={props.pageSize}
        total={props.total}
        current={props.current}
        onChange={props.onPageChange}
      />
    </>
  );
}
