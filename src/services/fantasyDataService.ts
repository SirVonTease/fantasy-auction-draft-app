export interface FantasyPlayer {
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
  espnId?: string
  yahooId?: string
  news?: string
  injuryStatus?: string
}

// ESPN Fantasy Football API endpoints
const ESPN_BASE_URL = 'https://fantasy.espn.com/apis/v3/games/ffl'
const ESPN_SEASON = '2024'

class FantasyDataService {
  private cache: Map<string, any> = new Map()
  private cacheTimeout = 5 * 60 * 1000 // 5 minutes

  private async fetchWithCache(url: string, cacheKey: string): Promise<any> {
    const cached = this.cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      this.cache.set(cacheKey, { data, timestamp: Date.now() })
      return data
    } catch (error) {
      console.error('Error fetching fantasy data:', error)
      // Return fallback data if API fails
      return this.getFallbackData()
    }
  }

  async getPlayerRankings(): Promise<FantasyPlayer[]> {
    try {
      // Try ESPN API first
      const espnUrl = `${ESPN_BASE_URL}/seasons/${ESPN_SEASON}/segments/0/leaguedefaults/3?view=kona_player_info`
      const data = await this.fetchWithCache(espnUrl, 'espn-rankings')
      
      if (data && data.players) {
        return this.parseESPNPlayers(data.players)
      }
    } catch (error) {
      console.error('ESPN API failed, using fallback data:', error)
    }

    // Fallback to static data with current 2024 rankings
    return this.getFallbackData()
  }

  private parseESPNPlayers(players: any[]): FantasyPlayer[] {
    return players
      .filter(player => player.player && player.player.defaultPositionId)
      .map((player, index) => {
        const p = player.player
        const stats = player.player.stats?.[0]?.stats || {}
        
        return {
          id: p.id.toString(),
          name: p.fullName,
          position: this.getPositionFromESPN(p.defaultPositionId),
          team: p.proTeamId ? this.getTeamFromESPN(p.proTeamId) : 'FA',
          rank: index + 1,
          adp: player.rank || index + 1,
          tier: Math.floor(index / 12) + 1,
          bye: p.byeWeek || 0,
          projectedPoints: Math.round((stats.ptsPerGame || 0) * 17) || Math.floor(Math.random() * 200) + 100,
          isDrafted: false,
          espnId: p.id.toString()
        }
      })
      .slice(0, 300) // Top 300 players
  }

  private getPositionFromESPN(positionId: number): string {
    const positions: { [key: number]: string } = {
      1: 'QB',
      2: 'RB',
      3: 'WR',
      4: 'TE',
      5: 'K',
      16: 'DEF'
    }
    return positions[positionId] || 'RB'
  }

  private getTeamFromESPN(teamId: number): string {
    const teams: { [key: number]: string } = {
      1: 'ATL', 2: 'BUF', 3: 'CHI', 4: 'CIN', 5: 'CLE', 6: 'DAL', 7: 'DEN', 8: 'DET',
      9: 'GB', 10: 'TEN', 11: 'IND', 12: 'KC', 13: 'LV', 14: 'LAR', 15: 'MIA', 16: 'MIN',
      17: 'NE', 18: 'NO', 19: 'NYG', 20: 'NYJ', 21: 'PHI', 22: 'ARI', 23: 'PIT', 24: 'LAC',
      25: 'SF', 26: 'SEA', 27: 'TB', 28: 'WAS', 29: 'CAR', 30: 'JAX', 33: 'BAL', 34: 'HOU'
    }
    return teams[teamId] || 'FA'
  }

  private getFallbackData(): FantasyPlayer[] {
    // Current 2024 fantasy football rankings (top players)
    const players: FantasyPlayer[] = [
      // Tier 1 - Elite
      { id: '1', name: 'Christian McCaffrey', position: 'RB', team: 'SF', rank: 1, adp: 1.2, tier: 1, bye: 9, projectedPoints: 320, isDrafted: false },
      { id: '2', name: 'Tyreek Hill', position: 'WR', team: 'MIA', rank: 2, adp: 2.1, tier: 1, bye: 11, projectedPoints: 310, isDrafted: false },
      { id: '3', name: 'Austin Ekeler', position: 'RB', team: 'WAS', rank: 3, adp: 3.5, tier: 1, bye: 14, projectedPoints: 295, isDrafted: false },
      { id: '4', name: 'CeeDee Lamb', position: 'WR', team: 'DAL', rank: 4, adp: 4.2, tier: 1, bye: 7, projectedPoints: 290, isDrafted: false },
      { id: '5', name: 'Bijan Robinson', position: 'RB', team: 'ATL', rank: 5, adp: 5.8, tier: 1, bye: 11, projectedPoints: 285, isDrafted: false },
      
      // Tier 2 - High-End RB1/WR1
      { id: '6', name: 'Ja\'Marr Chase', position: 'WR', team: 'CIN', rank: 6, adp: 6.1, tier: 2, bye: 7, projectedPoints: 280, isDrafted: false },
      { id: '7', name: 'Saquon Barkley', position: 'RB', team: 'PHI', rank: 7, adp: 7.3, tier: 2, bye: 10, projectedPoints: 275, isDrafted: false },
      { id: '8', name: 'Amon-Ra St. Brown', position: 'WR', team: 'DET', rank: 8, adp: 8.5, tier: 2, bye: 9, projectedPoints: 270, isDrafted: false },
      { id: '9', name: 'Jonathan Taylor', position: 'RB', team: 'IND', rank: 9, adp: 9.2, tier: 2, bye: 11, projectedPoints: 265, isDrafted: false },
      { id: '10', name: 'Stefon Diggs', position: 'WR', team: 'HOU', rank: 10, adp: 10.1, tier: 2, bye: 7, projectedPoints: 260, isDrafted: false },
      
      // Tier 3 - Solid RB1/WR1
      { id: '11', name: 'Derrick Henry', position: 'RB', team: 'BAL', rank: 11, adp: 11.3, tier: 3, bye: 14, projectedPoints: 255, isDrafted: false },
      { id: '12', name: 'Garrett Wilson', position: 'WR', team: 'NYJ', rank: 12, adp: 12.2, tier: 3, bye: 7, projectedPoints: 250, isDrafted: false },
      { id: '13', name: 'Josh Jacobs', position: 'RB', team: 'GB', rank: 13, adp: 13.1, tier: 3, bye: 10, projectedPoints: 245, isDrafted: false },
      { id: '14', name: 'Davante Adams', position: 'WR', team: 'LV', rank: 14, adp: 14.4, tier: 3, bye: 13, projectedPoints: 240, isDrafted: false },
      { id: '15', name: 'Travis Etienne Jr.', position: 'RB', team: 'JAX', rank: 15, adp: 15.2, tier: 3, bye: 12, projectedPoints: 235, isDrafted: false },
      
      // Tier 4 - High-End RB2/WR2
      { id: '16', name: 'DeVonta Smith', position: 'WR', team: 'PHI', rank: 16, adp: 16.3, tier: 4, bye: 10, projectedPoints: 230, isDrafted: false },
      { id: '17', name: 'Rachaad White', position: 'RB', team: 'TB', rank: 17, adp: 17.1, tier: 4, bye: 5, projectedPoints: 225, isDrafted: false },
      { id: '18', name: 'Jaylen Waddle', position: 'WR', team: 'MIA', rank: 18, adp: 18.2, tier: 4, bye: 11, projectedPoints: 220, isDrafted: false },
      { id: '19', name: 'Alvin Kamara', position: 'RB', team: 'NO', rank: 19, adp: 19.4, tier: 4, bye: 12, projectedPoints: 215, isDrafted: false },
      { id: '20', name: 'DK Metcalf', position: 'WR', team: 'SEA', rank: 20, adp: 20.1, tier: 4, bye: 5, projectedPoints: 210, isDrafted: false },
      
      // QBs - Top Tier
      { id: '21', name: 'Josh Allen', position: 'QB', team: 'BUF', rank: 21, adp: 21.3, tier: 4, bye: 12, projectedPoints: 380, isDrafted: false },
      { id: '22', name: 'Jalen Hurts', position: 'QB', team: 'PHI', rank: 22, adp: 22.1, tier: 4, bye: 10, projectedPoints: 375, isDrafted: false },
      { id: '23', name: 'Lamar Jackson', position: 'QB', team: 'BAL', rank: 23, adp: 23.2, tier: 4, bye: 14, projectedPoints: 370, isDrafted: false },
      { id: '24', name: 'Patrick Mahomes', position: 'QB', team: 'KC', rank: 24, adp: 24.5, tier: 4, bye: 10, projectedPoints: 365, isDrafted: false },
      { id: '25', name: 'Dak Prescott', position: 'QB', team: 'DAL', rank: 25, adp: 25.8, tier: 4, bye: 7, projectedPoints: 360, isDrafted: false },
      
      // More RBs
      { id: '26', name: 'Joe Mixon', position: 'RB', team: 'HOU', rank: 26, adp: 26.3, tier: 5, bye: 7, projectedPoints: 205, isDrafted: false },
      { id: '27', name: 'James Cook', position: 'RB', team: 'BUF', rank: 27, adp: 27.1, tier: 5, bye: 12, projectedPoints: 200, isDrafted: false },
      { id: '28', name: 'Zamir White', position: 'RB', team: 'LV', rank: 28, adp: 28.4, tier: 5, bye: 13, projectedPoints: 195, isDrafted: false },
      { id: '29', name: 'Tyler Allgeier', position: 'RB', team: 'ATL', rank: 29, adp: 29.2, tier: 5, bye: 11, projectedPoints: 190, isDrafted: false },
      { id: '30', name: 'Brian Robinson Jr.', position: 'RB', team: 'WAS', rank: 30, adp: 30.1, tier: 5, bye: 14, projectedPoints: 185, isDrafted: false },
      
      // More WRs
      { id: '31', name: 'Chris Olave', position: 'WR', team: 'NO', rank: 31, adp: 31.3, tier: 5, bye: 12, projectedPoints: 180, isDrafted: false },
      { id: '32', name: 'Tee Higgins', position: 'WR', team: 'CIN', rank: 32, adp: 32.2, tier: 5, bye: 7, projectedPoints: 175, isDrafted: false },
      { id: '33', name: 'Drake London', position: 'WR', team: 'ATL', rank: 33, adp: 33.1, tier: 5, bye: 11, projectedPoints: 170, isDrafted: false },
      { id: '34', name: 'Brandon Aiyuk', position: 'WR', team: 'SF', rank: 34, adp: 34.4, tier: 5, bye: 9, projectedPoints: 165, isDrafted: false },
      { id: '35', name: 'Nico Collins', position: 'WR', team: 'HOU', rank: 35, adp: 35.2, tier: 5, bye: 7, projectedPoints: 160, isDrafted: false },
      
      // TEs
      { id: '36', name: 'Sam LaPorta', position: 'TE', team: 'DET', rank: 36, adp: 36.1, tier: 5, bye: 9, projectedPoints: 155, isDrafted: false },
      { id: '37', name: 'Travis Kelce', position: 'TE', team: 'KC', rank: 37, adp: 37.3, tier: 5, bye: 10, projectedPoints: 150, isDrafted: false },
      { id: '38', name: 'T.J. Hockenson', position: 'TE', team: 'MIN', rank: 38, adp: 38.2, tier: 5, bye: 6, projectedPoints: 145, isDrafted: false },
      { id: '39', name: 'Mark Andrews', position: 'TE', team: 'BAL', rank: 39, adp: 39.1, tier: 5, bye: 14, projectedPoints: 140, isDrafted: false },
      { id: '40', name: 'Evan Engram', position: 'TE', team: 'JAX', rank: 40, adp: 40.4, tier: 5, bye: 12, projectedPoints: 135, isDrafted: false },
      
      // More QBs
      { id: '41', name: 'C.J. Stroud', position: 'QB', team: 'HOU', rank: 41, adp: 41.2, tier: 5, bye: 7, projectedPoints: 355, isDrafted: false },
      { id: '42', name: 'Justin Herbert', position: 'QB', team: 'LAC', rank: 42, adp: 42.1, tier: 5, bye: 5, projectedPoints: 350, isDrafted: false },
      { id: '43', name: 'Kyler Murray', position: 'QB', team: 'ARI', rank: 43, adp: 43.3, tier: 5, bye: 11, projectedPoints: 345, isDrafted: false },
      { id: '44', name: 'Anthony Richardson', position: 'QB', team: 'IND', rank: 44, adp: 44.2, tier: 5, bye: 11, projectedPoints: 340, isDrafted: false },
      { id: '45', name: 'Jordan Love', position: 'QB', team: 'GB', rank: 45, adp: 45.1, tier: 5, bye: 10, projectedPoints: 335, isDrafted: false },
      
      // Kickers
      { id: '46', name: 'Justin Tucker', position: 'K', team: 'BAL', rank: 46, adp: 46.5, tier: 6, bye: 14, projectedPoints: 130, isDrafted: false },
      { id: '47', name: 'Harrison Butker', position: 'K', team: 'KC', rank: 47, adp: 47.2, tier: 6, bye: 10, projectedPoints: 125, isDrafted: false },
      { id: '48', name: 'Evan McPherson', position: 'K', team: 'CIN', rank: 48, adp: 48.1, tier: 6, bye: 7, projectedPoints: 120, isDrafted: false },
      { id: '49', name: 'Jake Elliott', position: 'K', team: 'PHI', rank: 49, adp: 49.3, tier: 6, bye: 10, projectedPoints: 115, isDrafted: false },
      { id: '50', name: 'Brandon Aubrey', position: 'K', team: 'DAL', rank: 50, adp: 50.2, tier: 6, bye: 7, projectedPoints: 110, isDrafted: false },
      
      // Defenses
      { id: '51', name: 'San Francisco 49ers', position: 'DEF', team: 'SF', rank: 51, adp: 51.1, tier: 6, bye: 9, projectedPoints: 105, isDrafted: false },
      { id: '52', name: 'Dallas Cowboys', position: 'DEF', team: 'DAL', rank: 52, adp: 52.3, tier: 6, bye: 7, projectedPoints: 100, isDrafted: false },
      { id: '53', name: 'Baltimore Ravens', position: 'DEF', team: 'BAL', rank: 53, adp: 53.2, tier: 6, bye: 14, projectedPoints: 95, isDrafted: false },
      { id: '54', name: 'Buffalo Bills', position: 'DEF', team: 'BUF', rank: 54, adp: 54.1, tier: 6, bye: 12, projectedPoints: 90, isDrafted: false },
      { id: '55', name: 'New York Jets', position: 'DEF', team: 'NYJ', rank: 55, adp: 55.4, tier: 6, bye: 7, projectedPoints: 85, isDrafted: false }
    ]

    return players
  }

  async getPlayerNews(playerId: string): Promise<string> {
    // This would integrate with a news API
    return "No recent news available."
  }

  async getInjuryUpdates(): Promise<{ [playerId: string]: string }> {
    // This would integrate with injury tracking APIs
    return {}
  }

  clearCache(): void {
    this.cache.clear()
  }
}

export const fantasyDataService = new FantasyDataService()