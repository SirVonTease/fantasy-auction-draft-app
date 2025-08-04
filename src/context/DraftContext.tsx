import React, { createContext, useContext, useReducer, ReactNode } from 'react'

export interface Player {
  id: string
  name: string
  position: string
  team: string
  rank: number
  adp: number
  tier: number
  bye: number
  projectedPoints: number
  isDrafted: boolean
  draftedBy?: string
  draftRound?: number
  draftPick?: number
  auctionPrice?: number
}

export interface Team {
  id: string
  name: string
  owner: string
  players: Player[]
  budget: number
  remainingBudget: number
  picks: number[]
}

export interface DraftSettings {
  leagueSize: number
  rosterSize: number
  isAuction: boolean
  budget: number
  positions: {
    QB: number
    RB: number
    WR: number
    TE: number
    FLEX: number
    K: number
    DEF: number
    BENCH: number
  }
}

interface DraftState {
  players: Player[]
  teams: Team[]
  currentPick: number
  currentRound: number
  isDraftStarted: boolean
  settings: DraftSettings
  searchQuery: string
  filteredPlayers: Player[]
}

type DraftAction =
  | { type: 'SET_PLAYERS'; payload: Player[] }
  | { type: 'DRAFT_PLAYER'; payload: { playerId: string; teamId: string; round: number; pick: number; price?: number } }
  | { type: 'SET_CURRENT_PICK'; payload: number }
  | { type: 'SET_CURRENT_ROUND'; payload: number }
  | { type: 'START_DRAFT' }
  | { type: 'SET_TEAMS'; payload: Team[] }
  | { type: 'SET_SETTINGS'; payload: DraftSettings }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'UNDO_LAST_PICK' }

const initialState: DraftState = {
  players: [],
  teams: [],
  currentPick: 1,
  currentRound: 1,
  isDraftStarted: false,
  settings: {
    leagueSize: 12,
    rosterSize: 16,
    isAuction: false,
    budget: 200,
    positions: {
      QB: 1,
      RB: 2,
      WR: 2,
      TE: 1,
      FLEX: 1,
      K: 1,
      DEF: 1,
      BENCH: 7
    }
  },
  searchQuery: '',
  filteredPlayers: []
}

function draftReducer(state: DraftState, action: DraftAction): DraftState {
  switch (action.type) {
    case 'SET_PLAYERS':
      return {
        ...state,
        players: action.payload,
        filteredPlayers: action.payload
      }
    
    case 'DRAFT_PLAYER':
      const updatedPlayers = state.players.map(player =>
        player.id === action.payload.playerId
          ? {
              ...player,
              isDrafted: true,
              draftedBy: action.payload.teamId,
              draftRound: action.payload.round,
              draftPick: action.payload.pick,
              auctionPrice: action.payload.price
            }
          : player
      )
      
      const updatedTeams = state.teams.map(team =>
        team.id === action.payload.teamId
          ? {
              ...team,
              players: [...team.players, state.players.find(p => p.id === action.payload.playerId)!],
              remainingBudget: action.payload.price ? team.remainingBudget - action.payload.price : team.remainingBudget
            }
          : team
      )
      
      return {
        ...state,
        players: updatedPlayers,
        teams: updatedTeams,
        currentPick: state.currentPick + 1,
        currentRound: Math.floor((state.currentPick + 1) / state.settings.leagueSize) + 1
      }
    
    case 'SET_CURRENT_PICK':
      return { ...state, currentPick: action.payload }
    
    case 'SET_CURRENT_ROUND':
      return { ...state, currentRound: action.payload }
    
    case 'START_DRAFT':
      return { ...state, isDraftStarted: true }
    
    case 'SET_TEAMS':
      return { ...state, teams: action.payload }
    
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload }
    
    case 'SET_SEARCH_QUERY':
      const query = action.payload.toLowerCase()
      const filtered = state.players.filter(player =>
        !player.isDrafted &&
        (player.name.toLowerCase().includes(query) ||
         player.position.toLowerCase().includes(query) ||
         player.team.toLowerCase().includes(query))
      )
      return {
        ...state,
        searchQuery: action.payload,
        filteredPlayers: filtered
      }
    
    case 'UNDO_LAST_PICK':
      // Implementation for undoing last pick
      return state
    
    default:
      return state
  }
}

interface DraftContextType {
  state: DraftState
  dispatch: React.Dispatch<DraftAction>
}

const DraftContext = createContext<DraftContextType | undefined>(undefined)

export function DraftProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(draftReducer, initialState)

  return (
    <DraftContext.Provider value={{ state, dispatch }}>
      {children}
    </DraftContext.Provider>
  )
}

export function useDraft() {
  const context = useContext(DraftContext)
  if (context === undefined) {
    throw new Error('useDraft must be used within a DraftProvider')
  }
  return context
}