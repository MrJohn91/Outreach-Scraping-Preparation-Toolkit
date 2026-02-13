import React, { useState } from 'react'
import { Search, History, Star, ChevronDown, ChevronRight } from 'lucide-react'

function SidebarNav({ view, setView, history, savedLeads, onHistoryClick, onLeadClick }) {
  const [historyExpanded, setHistoryExpanded] = useState(true)
  const [leadsExpanded, setLeadsExpanded] = useState(true)

  return (
    <div className="w-64 bg-sidebar border-r border-border flex flex-col h-full">
      {/* Logo/Header */}
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-white">BD Outreach</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2 mb-6">
          <button
            onClick={() => setView('search')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              view === 'search'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Search size={20} />
            <span className="font-medium">New Search</span>
          </button>
        </div>

        {/* History Section */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <button
              onClick={() => setHistoryExpanded(!historyExpanded)}
              className="p-1 text-gray-400 hover:text-white"
            >
              {historyExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            <button
              onClick={() => setView('history')}
              className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                view === 'history'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <History size={20} />
              <span className="font-medium">History</span>
              {history.length > 0 && (
                <span className="ml-auto text-xs bg-gray-700 px-2 py-1 rounded-full">
                  {history.length}
                </span>
              )}
            </button>
          </div>

          {historyExpanded && history.length > 0 && (
            <div className="ml-6 space-y-1 mt-2">
              {history.slice(0, 5).map((item, index) => (
                <button
                  key={index}
                  onClick={() => onHistoryClick(item)}
                  className="w-full text-left text-sm px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition truncate"
                >
                  {item.keyword || item.params?.keyword} - {item.location || item.params?.location || item.city || ''}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Saved Leads Section */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <button
              onClick={() => setLeadsExpanded(!leadsExpanded)}
              className="p-1 text-gray-400 hover:text-white"
            >
              {leadsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            <button
              onClick={() => setView('leads')}
              className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                view === 'leads'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Star size={20} />
              <span className="font-medium">Leads</span>
              {savedLeads.length > 0 && (
                <span className="ml-auto text-xs bg-gray-700 px-2 py-1 rounded-full">
                  {savedLeads.length}
                </span>
              )}
            </button>
          </div>

          {leadsExpanded && savedLeads.length > 0 && (
            <div className="ml-6 space-y-1 mt-2">
              {savedLeads.slice(0, 5).map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => onLeadClick(lead)}
                  className="w-full text-left text-sm px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition truncate"
                >
                  {lead.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border text-xs text-gray-500">
        <p>Outreach Scraping Toolkit v1.0</p>
      </div>
    </div>
  )
}

export default SidebarNav
