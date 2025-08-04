import React, { useEffect, useState } from 'react'
import { useDraft } from '../context/DraftContext'
import { Player } from '../context/DraftContext'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight,
  Users,
  Clock
} from 'lucide-react'

const DraftBoard = () => {
  const { state, dispatch } = useDraft()
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [isPaused, setIsPaused] = useState(false)

  // Load sample data on first render
  useEffect(() => {
    if (state.players.length === 0) {
      loadSampleData()
    }
  }, [])

  const loadSampleData = () => {
    const samplePlayers: Player[] = [
      { id: '1', name: 'Christian McCaffrey', position: 'RB', team: 'SF', rank: 1, adp: 1.2, tier: 1, bye: 9, projectedPoints: 320, isDrafted: false },
      { id: '2', name: 'Tyreek Hill', position: 'WR', team: 'MIA', rank: 2, adp: 2.1, tier: 1, bye: 11, projectedPoints: 310, isDrafted: false },
      { id: '3', name: 'Austin Ekeler', position: 'RB', team: 'WAS', rank: 3, adp: 3.5, tier: 1, bye: 14, projectedPoints: 295, isDrafted: false },
      { id: '4', name: 'CeeDee Lamb', position: 'WR', team: 'DAL', rank: 4, adp: 4.2, tier: 1, bye: 7, projectedPoints: 290, isDrafted: false },
      { id: '5', name: 'Bijan Robinson', position: 'RB', team: 'ATL', rank: 5, adp: 5.8, tier: 2, bye: 11, projectedPoints: 285, isDrafted: false },
      { id: '6', name: 'Ja\'Marr Chase', position: 'WR', team: 'CIN', rank: 6, adp: 6.1, tier: 2, bye: 7, projectedPoints: 280, isDrafted: false },
      { id: '7', name: 'Saquon Barkley', position: 'RB', team: 'PHI', rank: 7, adp: 7.3, tier: 2, bye: 10, projectedPoints: 275, isDrafted: false },
      { id: '8', name: 'Amon-Ra St. Brown', position: 'WR', team: 'DET', rank: 8, adp: 8.5, tier: 2, bye: 9, projectedPoints: 270, isDrafted: false },
      { id: '9', name: 'Jonathan Taylor', position: 'RB', team: 'IND', rank: 9, adp: 9.2, tier: 2, bye: 11, projectedPoints: 265, isDrafted: false },
      { id: '10', name: 'Stefon Diggs', position: 'WR', team: 'HOU', rank: 10, adp: 10.1, tier: 2, bye: 7, projectedPoints: 260, isDrafted: false },
    ]

    const sampleTeams = Array.from({ length: 12 }, (_, i) => ({
      id: `team-${i + 1}`,
      name: `Team ${i + 1}`,
      owner: `Owner ${i + 1}`,
      players: [],
      budget: 200,
      remainingBudget: 200,
      picks: Array.from({ length: 16 }, (_, j) => i + 1 + (j * 12))
    }))

    dispatch({ type: 'SET_PLAYERS', payload: samplePlayers })
    dispatch({ type: 'SET_TEAMS', payload: sampleTeams })
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

  return (
    <div className="space-y-6">
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