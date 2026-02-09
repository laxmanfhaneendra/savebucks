import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Container } from '../components/Layout/Container'
import EnterpriseSearchResults from '../components/Search/EnterpriseSearchResults'

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  
  const [filters, setFilters] = useState({
    q: query,
    type: searchParams.get('type') || 'all',
    sort: searchParams.get('sort') || 'relevance',
    page: parseInt(searchParams.get('page')) || 1,
    limit: 20
  })

  // Sync state with URL query
  useEffect(() => {
    setFilters(prev => ({ ...prev, q: query }))
  }, [query])

  // Enterprise search query
  const {
    data: searchResults,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['enterprise-search', filters],
    queryFn: () => api.search(filters),
    enabled: !!filters.q,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1
  })

  // Analytics mutation for tracking interactions
  const recordInteractionMutation = useMutation({
    mutationFn: (data) => api.post('/api/search/interaction', data),
    onError: (error) => console.error('Failed to record interaction:', error)
  })

  // Update URL when filters change
  useEffect(() => {
    const newParams = new URLSearchParams()
    
    if (filters.q) newParams.set('q', filters.q)
    if (filters.type && filters.type !== 'all') newParams.set('type', filters.type)
    if (filters.sort && filters.sort !== 'relevance') newParams.set('sort', filters.sort)
    if (filters.page && filters.page > 1) newParams.set('page', filters.page.toString())
    
    // Only update if changed to avoid loops
    if (newParams.toString() !== searchParams.toString()) {
      setSearchParams(newParams, { replace: true })
    }
  }, [filters, setSearchParams, searchParams])

  // Handle filter changes from results component
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page on filter change
    }))
  }

  // Handle result interactions for analytics
  const handleInteraction = (interactionData) => {
    recordInteractionMutation.mutate(interactionData)
  }

  if (!query) {
    return (
      <Container>
        <div className="py-12 text-center text-slate-500">
          <p>Please enter a search term above.</p>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="py-6 space-y-6">
        <EnterpriseSearchResults
          searchResults={searchResults}
          isLoading={isLoading}
          error={error}
          query={filters.q}
          onInteraction={handleInteraction}
          onFilterChange={handleFilterChange}
        />
      </div>
    </Container>
  )
}

export default SearchResults
