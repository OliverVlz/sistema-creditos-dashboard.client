export interface SearchFilters {
  searchTerm: string
  status: string | null
  role: string | null
}

export interface SearchClientProps {
  onFiltersChange?: (filters: SearchFilters) => void
}