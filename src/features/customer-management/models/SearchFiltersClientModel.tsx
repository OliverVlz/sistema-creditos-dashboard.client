export interface SearchFilters {
  searchTerm: string
  employmentStatus: string | null | undefined
  organizationId: string | null | undefined
}

export interface SearchClientProps {
  onFiltersChange?: (filters: SearchFilters) => void
}