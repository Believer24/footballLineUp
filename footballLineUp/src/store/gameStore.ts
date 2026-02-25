import { create } from 'zustand';
import type { GameFormat, Player } from '../types';
import { SAMPLE_PLAYERS } from '../data/players';
import { FORMATIONS } from '../data/formations';

interface MatchInfo {
  date: string;
  time: string;
  location: string;
}

interface GameState {
  gameFormat: GameFormat;
  selectedFormation: string;
  lineup: (Player | null)[];
  bench: Player[];
  matchInfo: MatchInfo | null;
  matchGenerated: boolean;
  generatedMatchId: number | null;
  matchRatings: Record<string, number>;
  setMatchRatings: (ratings: Record<string, number>) => void;
  setGameFormat: (format: GameFormat) => void;
  setSelectedFormation: (formation: string) => void;
  setLineup: (lineup: (Player | null)[]) => void;
  setBench: (bench: Player[]) => void;
  setMatchInfo: (info: MatchInfo | null) => void;
  setMatchGenerated: (generated: boolean, matchId?: number | null) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  movePlayerToLineup: (playerId: string, position: number) => void;
  movePlayerToBench: (playerId: string) => void;
  swapLineupPositions: (from: number, to: number) => void;
  switchFormat: (format: GameFormat) => void;
  autoArrangeLineup: () => void;
}

const getLineupSize = (format: GameFormat): number => {
  return format === '5v5' ? 5 : format === '7v7' ? 7 : 11;
};

const getInitialLineup = (format: GameFormat): (Player | null)[] => {
  return Array(getLineupSize(format)).fill(null);
};

export const useGameStore = create<GameState>((set, get) => ({
  gameFormat: '5v5',
  selectedFormation: '1-2-1',
  lineup: getInitialLineup('5v5'),
  bench: [...SAMPLE_PLAYERS],
  matchInfo: null,
  matchGenerated: false,
  generatedMatchId: null,
  matchRatings: {},
  setMatchRatings: (ratings) => set({ matchRatings: ratings }),

  setGameFormat: (format) => {
    const formations = FORMATIONS[format];
    const firstFormation = Object.keys(formations)[0];
    set({
      gameFormat: format,
      selectedFormation: firstFormation,
      lineup: getInitialLineup(format),
    });
  },

  setSelectedFormation: (formation) => set({ selectedFormation: formation }),

  setLineup: (lineup) => set({ lineup }),

  setBench: (bench) => set({ bench }),

  setMatchInfo: (info) => set({ matchInfo: info }),

  setMatchGenerated: (generated, matchId) => set({
    matchGenerated: generated,
    generatedMatchId: matchId ?? null
  }),

  addPlayer: (player) => set((state) => ({
    bench: [...state.bench, player],
  })),

  removePlayer: (playerId) => set((state) => ({
    bench: state.bench.filter((p) => p.id !== playerId),
    lineup: state.lineup.map((p) => (p?.id === playerId ? null : p)),
  })),

  movePlayerToLineup: (playerId, position) => set((state) => {
    const player = state.bench.find((p) => p.id === playerId);
    if (!player) return state;

    const newLineup = [...state.lineup];
    const existingPlayer = newLineup[position];
    newLineup[position] = player;

    const newBench = state.bench.filter((p) => p.id !== playerId);
    if (existingPlayer) {
      newBench.push(existingPlayer);
    }

    return { lineup: newLineup, bench: newBench };
  }),

  movePlayerToBench: (playerId) => set((state) => {
    const playerIndex = state.lineup.findIndex((p) => p?.id === playerId);
    if (playerIndex === -1) return state;

    const player = state.lineup[playerIndex];
    if (!player) return state;

    const newLineup = [...state.lineup];
    newLineup[playerIndex] = null;

    return {
      lineup: newLineup,
      bench: [...state.bench, player],
    };
  }),

  swapLineupPositions: (from, to) => set((state) => {
    const newLineup = [...state.lineup];
    const temp = newLineup[from];
    newLineup[from] = newLineup[to];
    newLineup[to] = temp;
    return { lineup: newLineup };
  }),

  // Switch format while preserving all current players
  switchFormat: (format) => {
    const state = get();
    const formations = FORMATIONS[format];
    const firstFormation = Object.keys(formations)[0];
    const newSize = getLineupSize(format);

    // Collect all current players (lineup + bench)
    const allPlayers = [
      ...state.lineup.filter(Boolean) as Player[],
      ...state.bench
    ];

    // Re-distribute into new lineup
    const newLineup: (Player | null)[] = Array(newSize).fill(null);
    const newBench: Player[] = [];

    allPlayers.forEach((player, i) => {
      if (i < newSize) {
        newLineup[i] = player;
      } else {
        newBench.push(player);
      }
    });

    set({
      gameFormat: format,
      selectedFormation: firstFormation,
      lineup: newLineup,
      bench: newBench,
      matchGenerated: false,
      generatedMatchId: null,
    });
  },

  // Auto-arrange: fill empty lineup slots from bench
  autoArrangeLineup: () => set((state) => {
    const newLineup = [...state.lineup];
    const remainingBench = [...state.bench];

    for (let i = 0; i < newLineup.length; i++) {
      if (!newLineup[i] && remainingBench.length > 0) {
        newLineup[i] = remainingBench.shift()!;
      }
    }

    return { lineup: newLineup, bench: remainingBench };
  }),
}));
