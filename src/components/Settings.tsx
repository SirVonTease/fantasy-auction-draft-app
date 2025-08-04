import React, { useState } from 'react'
import { useDraft } from '../context/DraftContext'
import { DraftSettings, Team } from '../context/DraftContext'
import { Settings as SettingsIcon, Users, DollarSign, Save, RotateCcw } from 'lucide-react'

const Settings = () => {
  const { state, dispatch } = useDraft()
  const [settings, setSettings] = useState<DraftSettings>(state.settings)
  const [teams, setTeams] = useState<Team[]>(state.teams)
  const [isEditing, setIsEditing] = useState(false)

  const handleSaveSettings = () => {
    dispatch({ type: 'SET_SETTINGS', payload: settings })
    dispatch({ type: 'SET_TEAMS', payload: teams })
    setIsEditing(false)
  }

  const handleReset = () => {
    setSettings(state.settings)
    setTeams(state.teams)
    setIsEditing(false)
  }

  const updateTeam = (teamId: string, field: keyof Team, value: string | number) => {
    setTeams(teams.map(team => 
      team.id === teamId ? { ...team, [field]: value } : team
    ))
  }

  const updatePosition = (position: keyof DraftSettings['positions'], value: number) => {
    setSettings({
      ...settings,
      positions: {
        ...settings.positions,
        [position]: value
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Draft Settings</h2>
          <SettingsIcon size={24} className="text-gray-500" />
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-primary"
          >
            {isEditing ? 'Cancel' : 'Edit Settings'}
          </button>
          
          {isEditing && (
            <>
              <button
                onClick={handleSaveSettings}
                className="btn-primary flex items-center space-x-2"
              >
                <Save size={16} />
                <span>Save</span>
              </button>
              <button
                onClick={handleReset}
                className="btn-secondary flex items-center space-x-2"
              >
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* League Settings */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">League Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              League Size
            </label>
            <select
              value={settings.leagueSize}
              onChange={(e) => setSettings({ ...settings, leagueSize: parseInt(e.target.value) })}
              disabled={!isEditing}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nfl-blue focus:border-transparent disabled:bg-gray-100"
            >
              {[8, 10, 12, 14, 16].map(size => (
                <option key={size} value={size}>{size} teams</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Roster Size
            </label>
            <select
              value={settings.rosterSize}
              onChange={(e) => setSettings({ ...settings, rosterSize: parseInt(e.target.value) })}
              disabled={!isEditing}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nfl-blue focus:border-transparent disabled:bg-gray-100"
            >
              {[12, 14, 16, 18, 20].map(size => (
                <option key={size} value={size}>{size} players</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Draft Type
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="draftType"
                  checked={!settings.isAuction}
                  onChange={() => setSettings({ ...settings, isAuction: false })}
                  disabled={!isEditing}
                  className="mr-2"
                />
                Snake Draft
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="draftType"
                  checked={settings.isAuction}
                  onChange={() => setSettings({ ...settings, isAuction: true })}
                  disabled={!isEditing}
                  className="mr-2"
                />
                Auction Draft
              </label>
            </div>
          </div>
          
          {settings.isAuction && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget per Team
              </label>
              <input
                type="number"
                value={settings.budget}
                onChange={(e) => setSettings({ ...settings, budget: parseInt(e.target.value) })}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nfl-blue focus:border-transparent disabled:bg-gray-100"
                min="100"
                max="500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Position Requirements */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Position Requirements</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(settings.positions).map(([position, count]) => (
            <div key={position}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {position}
              </label>
              <input
                type="number"
                value={count}
                onChange={(e) => updatePosition(position as keyof DraftSettings['positions'], parseInt(e.target.value))}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nfl-blue focus:border-transparent disabled:bg-gray-100"
                min="0"
                max="10"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Team Management */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Team Management</h3>
        <div className="space-y-4">
          {teams.map((team, index) => (
            <div key={team.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <input
                  type="text"
                  value={team.name}
                  onChange={(e) => updateTeam(team.id, 'name', e.target.value)}
                  disabled={!isEditing}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-nfl-blue focus:border-transparent disabled:bg-gray-100 font-semibold"
                  placeholder="Team Name"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={team.owner}
                  onChange={(e) => updateTeam(team.id, 'owner', e.target.value)}
                  disabled={!isEditing}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-nfl-blue focus:border-transparent disabled:bg-gray-100"
                  placeholder="Owner Name"
                />
              </div>
              {settings.isAuction && (
                <div className="w-24">
                  <input
                    type="number"
                    value={team.budget}
                    onChange={(e) => updateTeam(team.id, 'budget', parseInt(e.target.value))}
                    disabled={!isEditing}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-nfl-blue focus:border-transparent disabled:bg-gray-100"
                    placeholder="Budget"
                  />
                </div>
              )}
              <div className="text-sm text-gray-500">
                {team.players.length} players
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Status */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Current Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-nfl-blue">{state.currentRound}</div>
            <div className="text-sm text-gray-600">Current Round</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-draft-green">{state.currentPick}</div>
            <div className="text-sm text-gray-600">Current Pick</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-draft-yellow">
              {state.players.filter(p => p.isDrafted).length}
            </div>
            <div className="text-sm text-gray-600">Players Drafted</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-draft-red">
              {state.players.filter(p => !p.isDrafted).length}
            </div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings