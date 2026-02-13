import React, { useState, useEffect } from 'react'
import SidebarNav from './components/SidebarNav'
import SearchForm from './components/SearchForm'
import ResultsTable from './components/ResultsTable'
import DetailSidebar from './components/DetailSidebar'

function App() {
  // State management
  const [results, setResults] = useState([])
  const [selectedLead, setSelectedLead] = useState(null)
  const [history, setHistory] = useState([])
  const [savedLeads, setSavedLeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [audienceConfig, setAudienceConfig] = useState(null)
  const [view, setView] = useState('search') // 'search', 'history', 'leads'

  // Load initial data
  useEffect(() => {
    loadAudienceConfig()
    loadHistory()
    loadSavedLeads()
  }, [])

  const loadAudienceConfig = async () => {
    try {
      const response = await fetch('/api/config/audience')
      const data = await response.json()
      setAudienceConfig(data.data)
    } catch (error) {
      console.error('Failed to load audience config:', error)
    }
  }

  const loadHistory = async () => {
    try {
      const response = await fetch('/history')
      const data = await response.json()
      setHistory(data.history || [])
    } catch (error) {
      console.error('Failed to load history:', error)
    }
  }

  const loadSavedLeads = async () => {
    try {
      const response = await fetch('/leads')
      const data = await response.json()
      setSavedLeads(data.leads || [])
    } catch (error) {
      console.error('Failed to load saved leads:', error)
    }
  }

  const handleSearch = async (searchParams) => {
    setLoading(true)
    try {
      const response = await fetch('/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      })

      const data = await response.json()

      if (data.status === 'success') {
        setResults(data.results || [])
        setView('search')
        await loadHistory()
      } else {
        alert('Search failed: ' + (data.detail || 'Unknown error'))
      }
    } catch (error) {
      console.error('Search failed:', error)
      alert('Search failed: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectLead = (lead) => {
    setSelectedLead(lead)
  }

  const handleSaveLead = async (lead) => {
    try {
      const response = await fetch('/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lead),
      })

      const data = await response.json()

      if (data.status === 'success') {
        await loadSavedLeads()
        alert('Lead saved successfully!')
      } else {
        alert('Failed to save lead')
      }
    } catch (error) {
      console.error('Failed to save lead:', error)
      alert('Failed to save lead: ' + error.message)
    }
  }

  const handleDeleteLead = async (leadId) => {
    try {
      const response = await fetch(`/leads/${leadId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.status === 'success') {
        await loadSavedLeads()
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead(null)
        }
      } else {
        alert('Failed to delete lead')
      }
    } catch (error) {
      console.error('Failed to delete lead:', error)
      alert('Failed to delete lead: ' + error.message)
    }
  }

  const handleHistoryClick = async (historyItem) => {
    // Re-run the search with saved params
    setLoading(true)
    try {
      const searchParams = {
        keyword: historyItem.keyword || historyItem.params?.keyword,
        location: historyItem.location || historyItem.params?.location || `${historyItem.city || historyItem.params?.city}, ${historyItem.state || historyItem.params?.state}`.trim(),
        platform: historyItem.platform || historyItem.params?.platform || 'linkedin',
        max_results: historyItem.max_results || historyItem.params?.max_results || 20
      }

      const response = await fetch('/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      })

      const data = await response.json()

      if (data.status === 'success') {
        setResults(data.results || [])
        setView('search')
        await loadHistory()
      } else {
        alert('Search failed: ' + (data.detail || 'Unknown error'))
      }
    } catch (error) {
      console.error('Failed to load history item:', error)
      alert('Failed to re-run search: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadCSV = async () => {
    try {
      const response = await fetch('/download-csv')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'leads.csv'
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download CSV:', error)
      alert('Failed to download CSV: ' + error.message)
    }
  }

  const isLeadSaved = (leadId) => {
    return savedLeads.some(lead => lead.id === leadId)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Left Sidebar */}
      <SidebarNav
        view={view}
        setView={setView}
        history={history}
        savedLeads={savedLeads}
        onHistoryClick={handleHistoryClick}
        onLeadClick={handleSelectLead}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-8">
          {view === 'search' && (
            <>
              <SearchForm
                onSearch={handleSearch}
                loading={loading}
                audienceConfig={audienceConfig}
              />

              {results.length > 0 && (
                <ResultsTable
                  results={results}
                  onSelectLead={handleSelectLead}
                  onSaveLead={handleSaveLead}
                  onDownloadCSV={handleDownloadCSV}
                  isLeadSaved={isLeadSaved}
                />
              )}
            </>
          )}

          {view === 'history' && (
            <div className="bg-panel rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Search History</h2>
              <p className="text-sm text-gray-400 mb-4">Click any search to re-run it and load results</p>
              {history.length === 0 ? (
                <p className="text-gray-400">No search history yet</p>
              ) : (
                <div className="space-y-3">
                  {history.map((item, index) => (
                    <div
                      key={index}
                      className="bg-background p-4 rounded-lg cursor-pointer hover:bg-gray-800 transition"
                      onClick={() => handleHistoryClick(item)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">
                            {item.keyword || item.params?.keyword} in {item.location || item.params?.location || `${item.city || item.params?.city || ''}, ${item.state || item.params?.state || ''}`.replace(/^, |, $/g, '')}
                          </p>
                          <p className="text-sm text-gray-400">
                            {item.result_count || item.params?.result_count || 0} results • {item.platform || item.params?.platform || 'linkedin'} • {new Date(item.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-xs bg-blue-600/30 text-blue-400 px-2 py-1 rounded">
                          Re-run
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {view === 'leads' && (
            <div className="bg-panel rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Saved Leads</h2>
              {savedLeads.length === 0 ? (
                <p className="text-gray-400">No saved leads yet</p>
              ) : (
                <div className="space-y-3">
                  {savedLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-background p-4 rounded-lg cursor-pointer hover:bg-gray-800 transition"
                      onClick={() => handleSelectLead(lead)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{lead.name}</p>
                          <p className="text-sm text-gray-400">{lead.address}</p>
                          {lead.phone && (
                            <p className="text-sm text-gray-400">{lead.phone}</p>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteLead(lead.id)
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Detail Sidebar */}
      {selectedLead && (
        <DetailSidebar
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onSave={handleSaveLead}
          isSaved={isLeadSaved(selectedLead.id)}
        />
      )}
    </div>
  )
}

export default App
