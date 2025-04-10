import { useState } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  const [jumpPage, setJumpPage] = useState('');

  const handleJump = () => {
    const num = parseInt(jumpPage);
    if (!isNaN(num) && num >= 1 && num <= totalPages) {
      onPageChange(num);
    }
  };

  const getVisiblePages = () => {
    const pages = [];
    const start = Math.max(currentPage - 2, 1);
    const end = Math.min(start + 4, totalPages);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="w-full d-flex flex-column align-items-center mt-4">
      <div className="d-flex flex-wrap gap-2 align-items-center justify-content-center mb-3">
        <button
          className="btn btn-outline-secondary btn-sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
        >
          ⏮ First
        </button>

        <button
          className="btn btn-outline-secondary btn-sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          ◀ Prev
        </button>

        {getVisiblePages().map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            style={
              num === currentPage
                ? {
                    backgroundColor: '#5e55aa',
                    color: 'white',
                    border: 'none',
                    fontWeight: 600,
                  }
                : undefined
            }
            className={`btn btn-sm ${
              num === currentPage ? '' : 'btn-outline-secondary'
            }`}
          >
            {num}
          </button>
        ))}

        <button
          className="btn btn-outline-secondary btn-sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next ▶
        </button>

        <button
          className="btn btn-outline-secondary btn-sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          Last ⏭
        </button>
      </div>

      <div className="d-flex gap-3 align-items-center">
        <label className="form-label m-0">
          Results per page:
          <select
            className="form-select form-select-sm d-inline-block ms-2"
            style={{ width: 'auto' }}
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </label>

        <div className="d-flex align-items-center gap-2">
          <input
            type="number"
            min={1}
            max={totalPages}
            value={jumpPage}
            placeholder="Page #"
            onChange={(e) => setJumpPage(e.target.value)}
            className="form-control form-control-sm"
            style={{ width: '100px' }}
          />
          <button
            className="btn btn-sm"
            style={{
              backgroundColor: '#5e55aa',
              color: 'white',
              border: 'none',
              fontWeight: 600,
            }}
            onClick={handleJump}
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
