import { Button } from 'primereact/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = (isMobile: boolean = false) => {
    const delta = isMobile ? 0 : 2
    const range: number[] = []
    const rangeWithDots: (number | string)[] = []

    if (isMobile) {
      // En móvil, solo mostrar página actual
      return [currentPage]
    }

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Button
        icon="pi pi-chevron-left"
        size="small"
        text
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300 touch-manipulation"
      />

      {/* Desktop Pagination */}
      <div className="hidden sm:flex items-center gap-2">
        {totalPages <= 7 ? (
          Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              label={page.toString()}
              size="small"
              text={currentPage !== page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-lg touch-manipulation ${
                currentPage === page
                  ? 'bg-orange-500 dark:bg-orange-600 text-white'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            />
          ))
        ) : (
          getPageNumbers(false).map((page, index) => (
            <span key={index}>
              {page === '...' ? (
                <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
              ) : (
                <Button
                  label={page.toString()}
                  size="small"
                  text={currentPage !== page}
                  onClick={() => onPageChange(Number(page))}
                  className={`w-8 h-8 rounded-lg touch-manipulation ${
                    currentPage === page
                      ? 'bg-orange-500 dark:bg-orange-600 text-white'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                />
              )}
            </span>
          ))
        )}
      </div>

      {/* Mobile Pagination - Only current page */}
      <div className="sm:hidden flex items-center">
        <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentPage} / {totalPages}
        </span>
      </div>

      <Button
        icon="pi pi-chevron-right"
        size="small"
        text
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300 touch-manipulation"
      />
    </div>
  )
}
