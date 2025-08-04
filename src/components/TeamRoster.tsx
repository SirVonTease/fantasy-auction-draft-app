import React, { useState } from 'react'
import { useDraft } from '../context/DraftContext'
import { Team, Player } from '../context/DraftContext'
import { Users, Trophy, DollarSign, Target } from 'lucide-react'

const TeamRoster = () => {
  const { state } = useDraft()
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)

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

  const getPositionCounts = (players: Player[]) => {
    return players.reduce((acc, player) => {
      acc[player.position] = (acc[player.position] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  const getTotalProjectedPoints = (players: Player[]) => {
    return players.reduce((total, player) => total + player.projectedPoints, 0)
  }

  const getTotalSpent = (players: Player[]) => {
    return players.reduce((total, player) => total + (player.auctionPrice || 0), 0)
  }

  const selectedTeamData = selectedTeam ? state.teams.find(t => t.id === selectedTeam) : null

  return (
    <div className="space-y-6">
      {/* League Overview */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">League Overview</h2>
          <Users size={24} className="text-gray-500" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-nfl-blue">{state.teams.length}</div>
            <div className="text-sm text-gray-600">Teams</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-draft-green">
              {state.players.filter(p => p.isDrafted).length}
            </div>
            <div className="text-sm text-gray-600">Players Drafted</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-draft-yellow">
              {state.currentRound}
            </div>
            <div className="text-sm text-gray-600">Current Round</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-draft-red">
              {state.settings.isAuction ? '$' : ''}{state.settings.budget}
            </div>
            <div className="text-sm text-gray-600">
              {state.settings.isAuction ? 'Budget' : 'Draft Type'}
            </div>
          </div>
        </div>
      </div>

      {/* Team Selection */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Select Team</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {state.teams.map((team) => (
            <button
              key={team.id}
              onClick={() => setSelectedTeam(team.id)}
              className={`p-4 rounded-lg border-2 transition-colors duration-200 ${
                selectedTeam === team.id
                  ? 'border-nfl-blue bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="font-semibold">{team.name}</div>
                <div className="text-sm text-gray-600">{team.owner}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {team.players.length} players
                </div>
                {state.settings.isAuction && (
                  <div className="text-xs text-gray-500">
                    ${team.remainingBudget} left
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Team Details */}
      {selectedTeamData && (
        <div className="space-y-6">
          {/* Team Header */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">{selectedTeamData.name}</h2>
                <p className="text-gray-600">Owner: {selectedTeamData.owner}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-draft-green">
                  {getTotalProjectedPoints(selectedTeamData.players)}
                </div>
                <div className="text-sm text-gray-600">Projected Points</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold">{selectedTeamData.players.length}</div>
                <div className="text-sm text-gray-600">Players</div>
              </div>
              {state.settings.isAuction && (
                <>
                  <div className="text-center">
                    <div className="text-lg font-semibold">${getTotalSpent(selectedTeamData.players)}</div>
                    <div className="text-sm text-gray-600">Spent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">${selectedTeamData.remainingBudget}</div>
                    <div className="text-sm text-gray-600">Remaining</div>
                  </div>
                </>
              )}
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {Math.round(getTotalProjectedPoints(selectedTeamData.players) / selectedTeamData.players.length)}
                </div>
                <div className="text-sm text-gray-600">Avg Points</div>
              </div>
            </div>
          </div>

          {/* Position Breakdown */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Position Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(getPositionCounts(selectedTeamData.players)).map(([position, count]) => (
                <div key={position} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-700">{count}</div>
                  <div className="text-sm text-gray-600">{position}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Roster */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Roster</h3>
            <div className="space-y-3">
              {selectedTeamData.players.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No players drafted yet</p>
                </div>
              ) : (
                selectedTeamData.players
                  .sort((a, b) => (a.draftPick || 0) - (b.draftPick || 0))
                  .map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-[60px]">
                          <div className="text-sm font-bold text-gray-500">#{player.draftPick}</div>
                          <div className="text-xs text-gray-400">R{player.draftRound}</div>
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
                        {player.auctionPrice && (
                          <div className="text-right">
                            <div className="text-sm font-semibold text-draft-yellow">${player.auctionPrice}</div>
                            <div className="text-xs text-gray-500">bid</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamRoster