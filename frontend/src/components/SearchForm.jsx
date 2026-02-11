import React, { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'

const PLATFORMS = [
  { id: 'linkedin', name: 'LinkedIn', icon: '🔗' },
  { id: 'x', name: 'X (Twitter)', icon: '𝕏' },
]

function SearchForm({ onSearch, loading, audienceConfig }) {
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  const [platform, setPlatform] = useState('linkedin')
  const [maxResults, setMaxResults] = useState(20)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!keyword) {
      alert('Please enter a keyword')
      return
    }

    onSearch({
      keyword,
      location,
      platform,
      max_results: maxResults,
    })
  }

  const selectedPlatform = PLATFORMS.find(p => p.id === platform)

  return (
    <div className="bg-panel rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6">Find Your Leads</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Platform Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Platform *
          </label>
          <div className="grid grid-cols-2 gap-2 max-w-md">
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlatform(p.id)}
                disabled={loading}
                className={`px-4 py-3 rounded-lg border transition flex items-center justify-center gap-2 ${
                  platform === p.id
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-background border-border text-gray-400 hover:border-gray-500 hover:text-white'
                } disabled:opacity-50`}
              >
                <span>{p.icon}</span>
                <span className="text-sm font-medium">{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Keyword Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Keyword / Search Term *
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g., AI founders, Web3 startups"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* Location Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Location (optional)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Berlin, Germany"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* Max Results Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Number of Results
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={maxResults}
              onChange={(e) => setMaxResults(Math.min(100, Math.max(1, Number(e.target.value) || 1)))}
              placeholder="20"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Searching {selectedPlatform?.name}...</span>
            </>
          ) : (
            <>
              <Search size={20} />
              <span>Search {selectedPlatform?.name}</span>
            </>
          )}
        </button>
      </form>

      {loading && (
        <div className="mt-4 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
          <p className="text-blue-300 text-sm">
            Searching {selectedPlatform?.name} for "{keyword}". This may take a minute...
          </p>
        </div>
      )}
    </div>
  )
}

export default SearchForm
