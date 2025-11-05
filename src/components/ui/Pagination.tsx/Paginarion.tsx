
//=================================================================
// 3. COMPONENTE PAGINATION
// (Idealmente, esto iría en /components/ui/Pagination.tsx)
//=================================================================
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  // Lógica simple para mostrar páginas (puedes hacerla más compleja)
  const pages = [];
  pages.push(1);
  if (currentPage > 3) pages.push('...');
  if (currentPage > 2) pages.push(currentPage - 1);
  if (currentPage > 1 && currentPage < totalPages) pages.push(currentPage);
  if (currentPage < totalPages - 1) pages.push(currentPage + 1);
  if (currentPage < totalPages - 2) pages.push('...');
  if (totalPages > 1) pages.push(totalPages);

  const uniquePages = [...new Set(pages)]; // Eliminar duplicados

  return (
    <nav className="flex items-center justify-between text-sm">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex items-center gap-2 mx-2">
        {uniquePages.map((page, index) => (
          page === '...' ? (
            <span key={index} className="px-2 py-1 text-gray-500">...</span>
          ) : (
            <button
              key={index}
              onClick={() => onPageChange(page as number)}
              className={`px-3 py-1 rounded-md ${
                page === currentPage
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              {page}
            </button>
          )
        ))}
        {/* En la imagen aparece hasta 60, lo simulamos */}
        <span className="px-2 py-1 text-gray-500">...</span>
        <button
          onClick={() => onPageChange(60)}
          className={`px-3 py-1 rounded-md ${
            60 === currentPage
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          60
        </button>
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronRight size={20} />
      </button>
    </nav>
  );
};

export default Pagination;
