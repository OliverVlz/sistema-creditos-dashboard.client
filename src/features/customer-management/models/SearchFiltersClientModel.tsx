export interface SearchFilters {
  searchTerm: string
  employmentStatus: string | null | undefined
}

export interface SearchClientProps {
  onFiltersChange?: (filters: SearchFilters) => void
}