import { BackArrowIcon } from "@/components/icons/BackArrowIcon";
import Button from "../forms/Button";

interface PaginationProps {
  total: number;
  currentPage: number;
  handleCurrentPage: (page: number) => void;
}

function Pagination(props: PaginationProps) {
  const { total, currentPage, handleCurrentPage } = props;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
      <nav className="mb-4 sm:mb-0 sm:order-1 w-full" role="navigation" aria-label="Navigation">
        <div className="flex justify-between w-full px-4">
          <div className="ml-3 first:ml-0">
            <Button
              onClick={() => {
                handleCurrentPage(currentPage - 1);
              }}
              style="secondary"
              disabled={currentPage === 0}
              icon={<BackArrowIcon />}
            ></Button>
          </div>
          <div className="text-sm text-gray-700 text-center sm:text-left my-auto">
            Page <span className="font-medium">{total > 0 ? currentPage + 1 : 0}</span> of{" "}
            <span className="font-medium">{total}</span>
          </div>
          <div className="ml-3 first:ml-0">
            <Button
              onClick={() => {
                handleCurrentPage(currentPage + 1);
              }}
              style="secondary"
              disabled={currentPage + 1 >= total}
              icon={<BackArrowIcon className="rotate-180" />}
            ></Button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Pagination;
