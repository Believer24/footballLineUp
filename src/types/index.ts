export type GameFormat = '5v5' | '7v7' | '11v11';
export type Position = 'GK' | 'CB' | 'LB' | 'RB' | 'CDM' | 'CM' | 'CAM' | 'LM' | 'RM' | 'LWB' | 'RWB' | 'LW' | 'RW' | 'ST' | 'CF' | 'DF' | 'MF' | 'FW';
export type PreferredPosition = 'GK' | 'DF' | 'MF' | 'FW';
export type CardRarity = 'bronze' | 'silver' | 'gold' | 'special';

export interface PlayerStats {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defense: number;
  physical: number;
}

export interface Player {
  id: string;
  name: string;
  avatar?: string;
  position: Position;
  preferredPosition: PreferredPosition;
  rating: number;
  rarity: CardRarity;
  stats: PlayerStats;
  jerseyNumber?: number;
  goals?: number;
  assists?: number;
  yellowCards?: number;
  redCards?: number;
  isMVP?: boolean;
}

export interface Match {
  id: string;
  date: string;
  time: string;
  location: string;
  format: GameFormat;
  maxPlayers: number;
  registeredPlayers: Player[];
  waitlist: Player[];
  status: 'upcoming' | 'ongoing' | 'completed';
  formation?: string;
  lineup?: (Player | null)[];
  matchReport?: MatchReport;
}

export interface MatchReport {
  matchId: string;
  goals: { playerId: string; minute: number }[];
  assists: { playerId: string; minute: number }[];
  yellowCards: { playerId: string; minute: number }[];
  redCards: { playerId: string; minute: number }[];
  mvpId?: string;
  score: { home: number; away: number };
}
