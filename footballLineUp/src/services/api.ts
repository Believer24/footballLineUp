const API_BASE = 'http://localhost:4000/api';

export interface PlayerData {
  id: number;
  name: string;
  preferred_position: 'GK' | 'DF' | 'MF' | 'FW';
  rating: number;
  avatar?: string;
  total_goals?: number;
  total_assists?: number;
  mvp_count?: number;
  matches_played?: number;
}

export interface MatchData {
  id: number;
  match_date: string;
  match_time?: string;
  location?: string;
  format: '5v5' | '7v7' | '11v11';
  formation?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  home_score: number;
  away_score: number;
  registered_count?: number;
  registrations?: any[];
  stats?: any[];
}

export const api = {
  // Players
  async getPlayers(): Promise<PlayerData[]> {
    const res = await fetch(`${API_BASE}/players`);
    return res.json();
  },

  async addPlayer(data: { name: string; preferred_position: string; rating?: number }): Promise<PlayerData> {
    const res = await fetch(`${API_BASE}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deletePlayer(id: number): Promise<void> {
    await fetch(`${API_BASE}/players/${id}`, { method: 'DELETE' });
  },

  // Matches
  async getMatches(date?: string): Promise<MatchData[]> {
    const url = date ? `${API_BASE}/matches?date=${date}` : `${API_BASE}/matches`;
    const res = await fetch(url);
    return res.json();
  },

  async getMatch(id: number): Promise<MatchData> {
    const res = await fetch(`${API_BASE}/matches/${id}`);
    return res.json();
  },

  async createMatch(data: { match_date: string; match_time?: string; location?: string; format?: string }): Promise<MatchData> {
    const res = await fetch(`${API_BASE}/matches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateMatch(id: number, data: Partial<MatchData>): Promise<void> {
    await fetch(`${API_BASE}/matches/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async deleteMatch(id: number): Promise<void> {
    await fetch(`${API_BASE}/matches/${id}`, { method: 'DELETE' });
  },

  // Registrations
  async registerPlayer(matchId: number, playerId: number): Promise<void> {
    await fetch(`${API_BASE}/matches/${matchId}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_id: playerId }),
    });
  },

  async unregisterPlayer(matchId: number, playerId: number): Promise<void> {
    await fetch(`${API_BASE}/matches/${matchId}/register/${playerId}`, { method: 'DELETE' });
  },

  // Stats
  async saveMatchStats(matchId: number, data: any): Promise<void> {
    await fetch(`${API_BASE}/matches/${matchId}/stats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async getLeaderboard(): Promise<PlayerData[]> {
    const res = await fetch(`${API_BASE}/stats/leaderboard`);
    return res.json();
  },

  // Batch Operations
  async importPlayers(matchId: number, players: { name: string; preferred_position: string; rating: number }[]): Promise<any> {
    const res = await fetch(`${API_BASE}/matches/${matchId}/import-players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ players }),
    });
    return res.json();
  },

  async batchSaveStats(matchId: number, data: {
    stats: any[];
    home_score: number;
    away_score: number;
    formation: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/matches/${matchId}/batch-stats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
