import React, { useEffect, useState } from 'react'
import { useDraft } from '../context/DraftContext'
import { Player } from '../context/DraftContext'
import { fantasyDataService, FantasyPlayer } from '../services/fantasyDataService'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight,
  Users,
  Clock,
  RefreshCw
} from 'lucide-react'

const DraftBoard = () => {
  const { state, dispatch } = useDraft()
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Load real fantasy data on first render
  useEffect(() => {
    if (state.players.length === 0) {
      loadFantasyData()
    }
  }, [])

  const loadFantasyData = async () => {
    setIsLoading(true)
    try {
      const players = await fantasyDataService.getPlayerRankings()
      const teams = Array.from({ length: 12 }, (_, i) => ({
        id: `team-${i + 1}`,
        name: `Team ${i + 1}`,
        owner: `Owner ${i + 1}`,
        players: [],
        budget: 200,
        remainingBudget: 200,
        picks: Array.from({ length: 16 }, (_, j) => i + 1 + (j * 12))
      }))

      dispatch({ type: 'SET_PLAYERS', payload: players })
      dispatch({ type: 'SET_TEAMS', payload: teams })
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error loading fantasy data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshData = async () => {
    fantasyDataService.clearCache()
    await loadFantasyData()
  }

  const handleDraftPlayer = (player: Player) => {
    if (!state.isDraftStarted) {
      dispatch({ type: 'START_DRAFT' })
    }

    const currentTeam = state.teams.find(team => 
      team.picks.includes(state.currentPick)
    )

    if (currentTeam) {
      dispatch({
        type: 'DRAFT_PLAYER',
        payload: {
          playerId: player.id,
          teamId: currentTeam.id,
          round: state.currentRound,
          pick: state.currentPick,
          price: state.settings.isAuction ? Math.floor(Math.random() * 50) + 10 : undefined
        }
      })
    }
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

  const availablePlayers = state.players.filter(p => !p.isDrafted).slice(0, 20)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4 text-nfl-blue" size={48} />
          <h2 className="text-xl font-semibold text-gray-700">Loading Fantasy Data...</h2>
          <p className="text-gray-500">Fetching latest player rankings and projections</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Data Status */}
      {lastUpdated && (
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RefreshCw size={16} className="text-blue-600" />
              <span className="text-sm text-blue-700">
                Data updated: {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
            <button
              onClick={refreshData}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Refresh
            </button>
          </div>
        </div>
      )}

      {/* Draft Status */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock size={20} className="text-gray-500" />
              <span className="font-semibold">
                Round {state.currentRound}, Pick {state.currentPick}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users size={20} className="text-gray-500" />
              <span className="text-sm text-gray-600">
                {state.teams.length} teams
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`p-2 rounded-lg ${
                isPaused ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {isPaused ? <Play size={16} /> : <Pause size={16} />}
            </button>
            <button className="p-2 rounded-lg bg-gray-100 text-gray-700">
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {state.isDraftStarted && (
          <div className="bg-gradient-to-r from-nfl-blue to-blue-600 text-white p-4 rounded-lg">
            <div className="text-center">
              <p className="text-sm opacity-90">On the Clock</p>
              <p className="text-xl font-bold">
                {state.teams.find(team => team.picks.includes(state.currentPick))?.name || 'Unknown Team'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Available Players */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Available Players</h2>
        <div className="grid gap-3">
          {availablePlayers.map((player) => (
            <div
              key={player.id}
              className="player-card"
              onClick={() => setSelectedPlayer(player)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-500">#{player.rank}</div>
                    <div className="text-xs text-gray-400">ADP: {player.adp}</div>
                  </div>
                  <div>
                    <div className="font-semibold">{player.name}</div>
                    <div className="text-sm text-gray-600">{player.team}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPositionColor(player.position)}`}>
                    {player.position}
                  </span>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{player.projectedPoints}</div>
                    <div className="text-xs text-gray-500">pts</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Draft Button */}
      {selectedPlayer && (
        <div className="fixed bottom-20 left-4 right-4 z-40">
          <button
            onClick={() => handleDraftPlayer(selectedPlayer)}
            className="w-full bg-draft-green hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-colors duration-200"
          >
            Draft {selectedPlayer.name} ({selectedPlayer.position} - {selectedPlayer.team})
          </button>
        </div>
      )}

      {/* Recent Picks */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Picks</h2>
        <div className="space-y-2">
          {state.players
            .filter(p => p.isDrafted)
            .sort((a, b) => (b.draftPick || 0) - (a.draftPick || 0))
            .slice(0, 5)
            .map((player) => (
              <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-500">#{player.draftPick}</div>
                    <div className="text-xs text-gray-400">R{player.draftRound}</div>
                  </div>
                  <div>
                    <div className="font-semibold">{player.name}</div>
                    <div className="text-sm text-gray-600">
                      {player.position} - {player.team}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">
                    {state.teams.find(t => t.id === player.draftedBy)?.name}
                  </div>
                  {player.auctionPrice && (
                    <div className="text-xs text-gray-500">${player.auctionPrice}</div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default DraftBoard