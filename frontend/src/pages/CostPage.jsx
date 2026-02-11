import React, { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, AlertCircle, Info } from 'lucide-react'

function CostPage() {
  const [costData, setCostData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadCostAnalysis()
  }, [])

  const loadCostAnalysis = async () => {
    try {
      const response = await fetch('/api/cost-analysis')
      const data = await response.json()

      if (data.status === 'success') {
        setCostData(data.data)
      } else {
        setError('Failed to load cost analysis')
      }
    } catch (err) {
      console.error('Failed to load cost analysis:', err)
      setError('Failed to load cost analysis: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const renderContent = (item) => {
    switch (item.type) {
      case 'title':
        return (
          <div key={item.content} className="mb-8">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <DollarSign className="text-green-400" size={32} />
              {item.content}
            </h1>
            {item.subsections && item.subsections.length > 0 && (
              <div className="space-y-8">
                {item.subsections.map((sub, idx) => (
                  <div key={idx}>{renderContent(sub)}</div>
                ))}
              </div>
            )}
          </div>
        )

      case 'section':
        return (
          <div key={item.title} className="mb-10 bg-gray-800/30 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
              {item.title}
            </h2>
            <div className="space-y-4 pl-3">
              {item.content && item.content.map((subItem, idx) => (
                <div key={idx}>{renderContent(subItem)}</div>
              ))}
            </div>
          </div>
        )

      case 'subsection':
        return (
          <div key={item.title} className="mb-6 mt-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-200">
              {item.title}
            </h3>
            <div className="space-y-3">
              {item.content && item.content.map((subItem, idx) => (
                <div key={idx}>{renderContent(subItem)}</div>
              ))}
            </div>
          </div>
        )

      case 'table':
        return (
          <div key={Math.random()} className="overflow-x-auto mb-6 rounded-lg border border-gray-700">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800">
                  {item.headers.map((header, idx) => (
                    <th
                      key={idx}
                      className="px-4 py-3 text-left text-sm font-semibold text-white border-b border-gray-600"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {item.rows.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className={`${rowIdx % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-800/50'} hover:bg-gray-700/50 transition`}
                  >
                    {row.map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        className={`px-4 py-3 text-sm ${cellIdx === 0 ? 'text-white font-medium' : 'text-gray-300'}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )

      case 'list':
        return (
          <ul key={Math.random()} className="space-y-2 mb-4">
            {item.items.map((listItem, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-300 leading-relaxed">
                <span className="text-blue-400 mt-1.5">•</span>
                <span>{listItem}</span>
              </li>
            ))}
          </ul>
        )

      case 'paragraph':
        const content = item.content

        // Check if it's a key metric (starts with **)
        if (content.includes('**')) {
          const parts = content.split('**')
          return (
            <p key={Math.random()} className="text-sm text-gray-300 leading-relaxed mb-3">
              {parts.map((part, idx) => (
                idx % 2 === 1 ? (
                  <strong key={idx} className="font-bold text-white">{part}</strong>
                ) : (
                  <span key={idx}>{part}</span>
                )
              ))}
            </p>
          )
        }

        // Regular paragraph
        return (
          <p key={Math.random()} className="text-sm text-gray-300 leading-relaxed mb-3">
            {content}
          </p>
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading cost analysis...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-md">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="text-red-400" size={24} />
            <h2 className="text-xl font-bold text-red-400">Error</h2>
          </div>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600/20 to-green-600/20 border border-blue-500/30 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Info className="text-blue-400 flex-shrink-0 mt-1" size={24} />
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Cost Insights & Planning</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Comprehensive cost breakdown for running the Outreach Scraping Toolkit at various scales.
                Use this data for budgeting, pricing strategies, and ROI calculations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-panel rounded-lg p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-green-500/20 p-1.5 rounded">
              <TrendingUp className="text-green-400" size={16} />
            </div>
            <h3 className="text-xs font-medium text-gray-400">Small Scale</h3>
          </div>
          <p className="text-xl font-bold text-white mb-1">$41 - $150</p>
          <p className="text-xs text-gray-500">1k-5k leads/month</p>
        </div>

        <div className="bg-panel rounded-lg p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-blue-500/20 p-1.5 rounded">
              <TrendingUp className="text-blue-400" size={16} />
            </div>
            <h3 className="text-xs font-medium text-gray-400">Medium Scale</h3>
          </div>
          <p className="text-xl font-bold text-white mb-1">$240 - $650</p>
          <p className="text-xs text-gray-500">10k-25k leads/month</p>
        </div>

        <div className="bg-panel rounded-lg p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-purple-500/20 p-1.5 rounded">
              <TrendingUp className="text-purple-400" size={16} />
            </div>
            <h3 className="text-xs font-medium text-gray-400">Large Scale</h3>
          </div>
          <p className="text-xl font-bold text-white mb-1">$1.2k - $2.5k</p>
          <p className="text-xs text-gray-500">50k-100k leads/month</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-panel rounded-lg p-6">
        {costData && costData.sections && costData.sections.map((section, idx) => (
          <div key={idx}>
            {renderContent(section)}
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-6 text-center text-sm text-gray-500">
        Last updated: February 2026 • Data sources: Apify, OpenAI, Anthropic, provider websites
      </div>
    </div>
  )
}

export default CostPage
