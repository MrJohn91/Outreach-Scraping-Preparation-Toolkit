import React from 'react'
import { X, Star, ExternalLink, MapPin, Users, AtSign, Globe, CheckCircle } from 'lucide-react'

function DetailSidebar({ lead, onClose, onSave, isSaved }) {
  const formatFollowers = (count) => {
    if (!count) return null
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  const getPlatformColor = (platform) => {
    const colors = {
      'LinkedIn': 'bg-blue-600',
      'X': 'bg-gray-600',
    }
    return colors[platform] || 'bg-gray-600'
  }

  return (
    <div className="w-96 bg-panel border-l border-border flex flex-col h-full animate-slide-in">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-xl font-bold pr-4">{lead.name || 'Unknown'}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Platform Badge */}
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getPlatformColor(lead.platform)}`}>
            {lead.platform}
          </span>
          {lead.verified && (
            <span className="flex items-center gap-1 text-blue-400 text-sm">
              <CheckCircle size={14} />
              Verified
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Handle/Role */}
        {lead.role && (
          <div className="flex items-start gap-3">
            <AtSign size={18} className="text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 mb-1">Handle / Role</p>
              <p className="text-white font-medium">{lead.role}</p>
            </div>
          </div>
        )}

        {/* Followers/Members */}
        {(lead.followers || lead.members) && (
          <div className="flex items-start gap-3">
            <Users size={18} className="text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 mb-1">
                {lead.members ? 'Members' : 'Followers'}
              </p>
              <p className="text-white font-medium">
                {formatFollowers(lead.followers || lead.members)}
              </p>
            </div>
          </div>
        )}

        {/* Location/Region */}
        {lead.region && (
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 mb-1">Location</p>
              <p className="text-white">{lead.region}</p>
            </div>
          </div>
        )}

        {/* Company */}
        {lead.company && (
          <div className="flex items-start gap-3">
            <Globe size={18} className="text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 mb-1">Company</p>
              <p className="text-white">{lead.company}</p>
            </div>
          </div>
        )}

        {/* Headline (LinkedIn specific) */}
        {lead.headline && lead.headline !== lead.role && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Headline</p>
            <p className="text-gray-300 text-sm">{lead.headline}</p>
          </div>
        )}

        {/* Bio/Description */}
        {(lead.bio || lead.description) && (
          <div>
            <p className="text-xs text-gray-500 mb-2">Bio</p>
            <p className="text-gray-300 text-sm leading-relaxed">
              {lead.bio || lead.description}
            </p>
          </div>
        )}

        {/* Industry */}
        {lead.industry && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Industry</p>
            <p className="text-white">{lead.industry}</p>
          </div>
        )}

        {/* Search Term */}
        {lead.notes && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Search Term</p>
            <span className="inline-block px-2 py-1 bg-gray-800 text-gray-300 rounded text-sm">
              {lead.notes}
            </span>
          </div>
        )}

        {/* Email (if available) */}
        {lead.email && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Email</p>
            <a
              href={`mailto:${lead.email}`}
              className="text-blue-400 hover:underline"
            >
              {lead.email}
            </a>
          </div>
        )}

        {/* Website (if available) */}
        {lead.website && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Website</p>
            <a
              href={lead.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline text-sm"
            >
              {lead.website}
            </a>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-border space-y-3">
        {/* View Profile */}
        {lead.contact_link && (
          <a
            href={lead.contact_link}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg transition font-medium ${getPlatformColor(lead.platform)} hover:opacity-90`}
          >
            <ExternalLink size={18} />
            <span>View {lead.platform} Profile</span>
          </a>
        )}

        {/* Save Lead */}
        <button
          onClick={() => onSave(lead)}
          disabled={isSaved}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition font-medium ${
            isSaved
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-yellow-600 hover:bg-yellow-700 text-white'
          }`}
        >
          <Star size={18} fill={isSaved ? 'currentColor' : 'none'} />
          <span>{isSaved ? 'Already Saved' : 'Save Lead'}</span>
        </button>
      </div>
    </div>
  )
}

export default DetailSidebar
