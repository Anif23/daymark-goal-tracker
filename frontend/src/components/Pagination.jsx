const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <button
        type="button"
        className="btn btn-sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      <span className="text-sm font-semibold text-slate-500">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        className="btn btn-sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
