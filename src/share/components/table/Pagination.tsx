import { Button } from 'primereact/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = () => {
    const delta = 2
    const range: number[] = []
    const rangeWithDots: (number | string)[] = []

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
    <div className="flex items-center gap-2">
      <Button
        icon="pi pi-chevron-left"
        size="small"
        text
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-8 h-8 rounded-lg disabled:opacity-50 hover:bg-gray-200"
      />

      {totalPages <= 7 ? (
        Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            label={page.toString()}
            size="small"
            text={currentPage !== page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-lg ${
              currentPage === page
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-200 text-gray-700'
            }`}
          />
        ))
      ) : (
        getPageNumbers().map((page, index) => (
          <span key={index}>
            {page === '...' ? (
              <span className="px-2 text-gray-500">...</span>
            ) : (
              <Button
                label={page.toString()}
                size="small"
                text={currentPage !== page}
                onClick={() => onPageChange(Number(page))}
                className={`w-8 h-8 rounded-lg ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-200 text-gray-700'
                }`}
              />
            )}
          </span>
        ))
      )}

      <Button
        icon="pi pi-chevron-right"
        size="small"
        text
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-8 h-8 rounded-lg disabled:opacity-50 hover:bg-gray-200"
      />
    </div>
  )
}