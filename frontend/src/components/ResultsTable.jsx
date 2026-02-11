import React, { useState } from 'react'
import { Download, Star, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'

function ResultsTable({ results, onSelectLead, onSaveLead, onDownloadCSV, isLeadSaved }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState(null)
  const [sortDirection, setSortDirection] = useState('asc')
  const resultsPerPage = 10

  // Sorting logic
  const sortedResults = React.useMemo(() => {
    if (!sortField) return results

    return [...results].sort((a, b) => {
      const aVal = a[sortField] || ''
      const bVal = b[sortField] || ''

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
      }

      if (sortDirection === 'asc') {
        return String(aVal).localeCompare(String(bVal))
      } else {
        return String(bVal).localeCompare(String(aVal))
      }
    })
  }, [results, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(sortedResults.length / resultsPerPage)
  const startIndex = (currentPage - 1) * resultsPerPage
  const endIndex = startIndex + resultsPerPage
  const currentResults = sortedResults.slice(startIndex, endIndex)

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)))
  }

  const formatFollowers = (count) => {
    if (!count) return '-'
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  const getPlatformBadge = (platform) => {
    const badges = {
      'LinkedIn': { bg: 'bg-blue-600/20', text: 'text-blue-400', label: 'LinkedIn' },
      'X': { bg: 'bg-gray-600/20', text: 'text-gray-300', label: 'X' },
    }
    const badge = badges[platform] || { bg: 'bg-gray-600/20', text: 'text-gray-400', label: platform }
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    )
  }

  return (
    <div className="bg-panel rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">
          Search Results ({results.length} leads found)
        </h3>
        <button
          onClick={onDownloadCSV}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
        >
          <Download size={18} />
          <span>Download CSV</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-gray-300 w-10"></th>
              <th
                className="text-left py-3 px-4 font-semibold text-gray-300 cursor-pointer hover:text-white"
                onClick={() => handleSort('name')}
              >
                Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="text-left py-3 px-4 font-semibold text-gray-300 cursor-pointer hover:text-white"
                onClick={() => handleSort('platform')}
              >
                Platform {sortField === 'platform' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="text-left py-3 px-4 font-semibold text-gray-300 cursor-pointer hover:text-white"
                onClick={() => handleSort('role')}
              >
                Handle/Role {sortField === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="text-left py-3 px-4 font-semibold text-gray-300 cursor-pointer hover:text-white"
                onClick={() => handleSort('followers')}
              >
                Followers {sortField === 'followers' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-300">
                Profile
              </th>
            </tr>
          </thead>
          <tbody>
            {currentResults.map((lead, index) => (
              <tr
                key={lead.id || index}
                onClick={() => onSelectLead(lead)}
                className="border-b border-border hover:bg-gray-800 cursor-pointer transition"
              >
                <td className="py-3 px-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSaveLead(lead)
                    }}
                    className={`${
                      isLeadSaved(lead.id)
                        ? 'text-yellow-400'
                        : 'text-gray-500 hover:text-yellow-400'
                    } transition`}
                    title={isLeadSaved(lead.id) ? 'Already saved' : 'Save lead'}
                  >
                    <Star size={18} fill={isLeadSaved(lead.id) ? 'currentColor' : 'none'} />
                  </button>
                </td>
                <td className="py-3 px-4 font-medium">{lead.name || 'Unknown'}</td>
                <td className="py-3 px-4">
                  {getPlatformBadge(lead.platform)}
                </td>
                <td className="py-3 px-4 text-gray-400 truncate max-w-[150px]">
                  {lead.role || '-'}
                </td>
                <td className="py-3 px-4 text-gray-400">
                  {formatFollowers(lead.followers || lead.members)}
                </td>
                <td className="py-3 px-4">
                  {lead.contact_link ? (
                    <a
                      href={lead.contact_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={14} />
                      <span>View</span>
                    </a>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-400">
            Showing {startIndex + 1} to {Math.min(endIndex, results.length)} of {results.length} results
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-background border border-border rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="px-4 py-1 bg-background border border-border rounded">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-background border border-border rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResultsTable
