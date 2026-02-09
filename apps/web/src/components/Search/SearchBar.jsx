import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useLocation } from '../../context/LocationContext'

export function SearchBar({ className = '' }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { location } = useLocation()

  useEffect(() => {
    // If we are on the search page, sync the input with the URL query
    if (window.location.pathname === '/search') {
      setQuery(searchParams.get('q') || '')
    }
  }, [searchParams])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      let url = `/search?q=${encodeURIComponent(query)}`
      if (location) {
        url += `&latitude=${location.latitude}&longitude=${location.longitude}`
      }
      navigate(url)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`relative flex-1 max-w-xl mx-auto ${className}`}>
      <div className="relative flex items-center w-full group">
        <div className="absolute left-4 text-slate-500 transition-colors group-focus-within:text-amber-500">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search deals, stores, or items..."
          className="w-full pl-12 pr-4 py-3 bg-slate-800 hover:bg-slate-700/80 focus:bg-slate-800 border-2 border-slate-700 focus:border-amber-500/50 rounded-2xl text-white placeholder-slate-500 transition-all duration-300 outline-none shadow-sm focus:shadow-lg focus:shadow-amber-500/10"
        />
        <button type="submit" className="hidden">Search</button>
      </div>
    </form>
  )
}
