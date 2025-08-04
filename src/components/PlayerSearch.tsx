import React, { useState } from 'react'
import { useDraft } from '../context/DraftContext'
import { Player } from '../context/DraftContext'
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react'

const PlayerSearch = () => {
  const { state, dispatch } = useDraft()
  const [searchQuery, setSearchQuery] = useState('')
  const [positionFilter, setPositionFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState<'rank' | 'adp' | 'projectedPoints'>('rank')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const positions = ['ALL', 'QB', 'RB', 'WR', 'TE', 'K', 'DEF']

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query })
  }

  const getPositionColor = (position: string) => {
    const colors = {
      QB: 'bg-blue-100 text-blue-800',
      RB: 'bg-green-100 text-green-800',
      WR: 'bg-purple-100 text-purple-800',
      TE: 'bg-orange-100 text-orange-800',
      K: 'bg-gray-100 text-gray-800',
      DEF: 'bg-red-100 text-red-800'
    }
    return colors[position as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const filteredPlayers = state.players
    .filter(player => !player.isDrafted)
    .filter(player => {
      const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          player.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          player.position.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPosition = positionFilter === 'ALL' || player.position === positionFilter
      return matchesSearch && matchesPosition
    })
    .sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]
      
      if (sortOrder === 'asc') {
        return aValue - bValue
      } else {
        return bValue - aValue
      }
    })

  const handleSort = (field: 'rank' | 'adp' | 'projectedPoints') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search players, teams, or positions..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nfl-blue focus:border-transparent"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Filter size={20} className="text-gray-500" />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {positions.map((pos) => (
            <button
              key={pos}
              onClick={() => setPositionFilter(pos)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                positionFilter === pos
                  ? 'bg-nfl-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Sort By</h2>
          <div className="flex items-center space-x-2">
            {sortOrder === 'asc' ? <SortAsc size={20} /> : <SortDesc size={20} />}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'rank', label: 'Rank' },
            { key: 'adp', label: 'ADP' },
            { key: 'projectedPoints', label: 'Points' }
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => handleSort(option.key as 'rank' | 'adp' | 'projectedPoints')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                sortBy === option.key
                  ? 'bg-draft-green text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Available Players</h2>
          <span className="text-sm text-gray-500">{filteredPlayers.length} players</span>
        </div>
        
        <div className="space-y-3">
          {filteredPlayers.slice(0, 50).map((player) => (
            <div
              key={player.id}
              className="player-card"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-center min-w-[60px]">
                    <div className="text-sm font-bold text-gray-500">#{player.rank}</div>
                    <div className="text-xs text-gray-400">ADP: {player.adp}</div>
                  </div>
                  <div>
                    <div className="font-semibold">{player.name}</div>
                    <div className="text-sm text-gray-600">{player.team}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPositionColor(player.position)}`}>
                    {player.position}
                  </span>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{player.projectedPoints}</div>
                    <div className="text-xs text-gray-500">pts</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-500">T{player.tier}</div>
                    <div className="text-xs text-gray-400">Bye: {player.bye}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredPlayers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Search size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No players found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PlayerSearch