export interface SearchFilters {
  searchTerm: string
  status: string | null | undefined
  role: string | null | undefined
}

export interface SearchUsersProps {
  onFiltersChange?: (filters: SearchFilters) => void
}
