import { MdChevronLeft, MdChevronRight } from "react-icons/md";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: PaginationProps) => {
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const getPages = (): (number | "...")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-slate-100">
      <p className="text-xs sm:text-sm text-slate-500">
        Showing <span className="font-semibold text-slate-700">{start}–{end}</span> of{" "}
        <span className="font-semibold text-slate-700">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-600"
          aria-label="Previous page"
        >
          <MdChevronLeft className="w-5 h-5" />
        </button>
        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={`dot-${i}`} className="px-1.5 text-slate-400 text-sm select-none">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${
                p === page
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-600"
          aria-label="Next page"
        >
          <MdChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;