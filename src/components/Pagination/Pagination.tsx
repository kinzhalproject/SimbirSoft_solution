import React from 'react';
import './Pagination.css';

interface PaginationProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

function buildPages(current: number, total: number): (number | string)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | string)[] = [1];
  if (current > 3) pages.push('...');
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
}

const Pagination: React.FC<PaginationProps> = ({ current, total, onChange }) => {
  const pages = buildPages(current, total);

  return (
    <div className="pagination">
      <button
        className="pag-btn"
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
        aria-label="Предыдущая страница"
      >
        ‹
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dot-${i}`} className="pag-dots">
            ...
          </span>
        ) : (
          <button
            key={p}
            className={`pag-btn${p === current ? ' active' : ''}`}
            onClick={() => onChange(p as number)}
            aria-label={`Страница ${p}`}
            aria-current={p === current ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        className="pag-btn"
        disabled={current === total}
        onClick={() => onChange(current + 1)}
        aria-label="Следующая страница"
      >
        ›
      </button>
    </div>
  );
};

export default Pagination;
