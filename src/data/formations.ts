export interface Position {
  x: number;
  y: number;
  label: string;
}

export interface Formation {
  positions: Position[];
}

export interface FormationSet {
  [key: string]: Formation;
}

export interface AllFormations {
  '5v5': FormationSet;
  '7v7': FormationSet;
  '11v11': FormationSet;
}

export const FORMATIONS: AllFormations = {
  '5v5': {
    '1-2-1': {
      positions: [
        { x: 50, y: 85, label: 'GK' },
        { x: 25, y: 60, label: 'CB' },
        { x: 75, y: 60, label: 'CB' },
        { x: 50, y: 40, label: 'CM' },
        { x: 50, y: 15, label: 'ST' },
      ]
    },
    '2-2': {
      positions: [
        { x: 50, y: 85, label: 'GK' },
        { x: 30, y: 60, label: 'CB' },
        { x: 70, y: 60, label: 'CB' },
        { x: 30, y: 25, label: 'ST' },
        { x: 70, y: 25, label: 'ST' },
      ]
    },
    '1-1-2': {
      positions: [
        { x: 50, y: 85, label: 'GK' },
        { x: 50, y: 60, label: 'CB' },
        { x: 50, y: 40, label: 'CM' },
        { x: 30, y: 15, label: 'ST' },
        { x: 70, y: 15, label: 'ST' },
      ]
    },
  },
  '7v7': {
    '2-3-1': {
      positions: [
        { x: 50, y: 85, label: 'GK' },
        { x: 30, y: 70, label: 'CB' },
        { x: 70, y: 70, label: 'CB' },
        { x: 20, y: 45, label: 'LM' },
        { x: 50, y: 45, label: 'CM' },
        { x: 80, y: 45, label: 'RM' },
        { x: 50, y: 15, label: 'ST' },
      ]
    },
    '3-2-1': {
      positions: [
        { x: 50, y: 85, label: 'GK' },
        { x: 20, y: 65, label: 'CB' },
        { x: 50, y: 65, label: 'CB' },
        { x: 80, y: 65, label: 'CB' },
        { x: 35, y: 40, label: 'CM' },
        { x: 65, y: 40, label: 'CM' },
        { x: 50, y: 15, label: 'ST' },
      ]
    },
    '3-3': {
      positions: [
        { x: 50, y: 85, label: 'GK' },
        { x: 20, y: 65, label: 'CB' },
        { x: 50, y: 65, label: 'CB' },
        { x: 80, y: 65, label: 'CB' },
        { x: 20, y: 25, label: 'LW' },
        { x: 50, y: 25, label: 'ST' },
        { x: 80, y: 25, label: 'RW' },
      ]
    },
  },
  '11v11': {
    '4-4-2': {
      positions: [
        { x: 50, y: 90, label: 'GK' },
        { x: 15, y: 72, label: 'LB' },
        { x: 38, y: 72, label: 'CB' },
        { x: 62, y: 72, label: 'CB' },
        { x: 85, y: 72, label: 'RB' },
        { x: 15, y: 45, label: 'LM' },
        { x: 38, y: 45, label: 'CM' },
        { x: 62, y: 45, label: 'CM' },
        { x: 85, y: 45, label: 'RM' },
        { x: 35, y: 18, label: 'ST' },
        { x: 65, y: 18, label: 'ST' },
      ]
    },
    '4-3-3': {
      positions: [
        { x: 50, y: 90, label: 'GK' },
        { x: 15, y: 72, label: 'LB' },
        { x: 38, y: 72, label: 'CB' },
        { x: 62, y: 72, label: 'CB' },
        { x: 85, y: 72, label: 'RB' },
        { x: 25, y: 45, label: 'CM' },
        { x: 50, y: 45, label: 'CM' },
        { x: 75, y: 45, label: 'CM' },
        { x: 20, y: 18, label: 'LW' },
        { x: 50, y: 18, label: 'ST' },
        { x: 80, y: 18, label: 'RW' },
      ]
    },
    '3-5-2': {
      positions: [
        { x: 50, y: 90, label: 'GK' },
        { x: 25, y: 72, label: 'CB' },
        { x: 50, y: 72, label: 'CB' },
        { x: 75, y: 72, label: 'CB' },
        { x: 10, y: 50, label: 'LWB' },
        { x: 35, y: 50, label: 'CM' },
        { x: 50, y: 42, label: 'CAM' },
        { x: 65, y: 50, label: 'CM' },
        { x: 90, y: 50, label: 'RWB' },
        { x: 35, y: 18, label: 'ST' },
        { x: 65, y: 18, label: 'ST' },
      ]
    },
    '4-2-3-1': {
      positions: [
        { x: 50, y: 90, label: 'GK' },
        { x: 15, y: 72, label: 'LB' },
        { x: 38, y: 72, label: 'CB' },
        { x: 62, y: 72, label: 'CB' },
        { x: 85, y: 72, label: 'RB' },
        { x: 35, y: 55, label: 'CDM' },
        { x: 65, y: 55, label: 'CDM' },
        { x: 20, y: 35, label: 'LW' },
        { x: 50, y: 35, label: 'CAM' },
        { x: 80, y: 35, label: 'RW' },
        { x: 50, y: 15, label: 'ST' },
      ]
    },
    '4-1-2-1-2': {
      positions: [
        { x: 50, y: 90, label: 'GK' },
        { x: 15, y: 72, label: 'LB' },
        { x: 38, y: 72, label: 'CB' },
        { x: 62, y: 72, label: 'CB' },
        { x: 85, y: 72, label: 'RB' },
        { x: 50, y: 58, label: 'CDM' },
        { x: 30, y: 45, label: 'CM' },
        { x: 70, y: 45, label: 'CM' },
        { x: 50, y: 32, label: 'CAM' },
        { x: 35, y: 18, label: 'ST' },
        { x: 65, y: 18, label: 'ST' },
      ]
    },
    '4-1-2-1-2 (2)': {
      positions: [
        { x: 50, y: 90, label: 'GK' },
        { x: 15, y: 72, label: 'LB' },
        { x: 38, y: 72, label: 'CB' },
        { x: 62, y: 72, label: 'CB' },
        { x: 85, y: 72, label: 'RB' },
        { x: 50, y: 60, label: 'CDM' },
        { x: 35, y: 47, label: 'CM' },
        { x: 65, y: 47, label: 'CM' },
        { x: 50, y: 34, label: 'CAM' },
        { x: 40, y: 18, label: 'ST' },
        { x: 60, y: 18, label: 'ST' },
      ]
    },
    '4-2-2-2': {
      positions: [
        { x: 50, y: 90, label: 'GK' },
        { x: 15, y: 72, label: 'LB' },
        { x: 38, y: 72, label: 'CB' },
        { x: 62, y: 72, label: 'CB' },
        { x: 85, y: 72, label: 'RB' },
        { x: 35, y: 55, label: 'CDM' },
        { x: 65, y: 55, label: 'CDM' },
        { x: 35, y: 35, label: 'CAM' },
        { x: 65, y: 35, label: 'CAM' },
        { x: 35, y: 18, label: 'ST' },
        { x: 65, y: 18, label: 'ST' },
      ]
    },
    '4-1-4-1': {
      positions: [
        { x: 50, y: 90, label: 'GK' },
        { x: 15, y: 72, label: 'LB' },
        { x: 38, y: 72, label: 'CB' },
        { x: 62, y: 72, label: 'CB' },
        { x: 85, y: 72, label: 'RB' },
        { x: 50, y: 58, label: 'CDM' },
        { x: 15, y: 40, label: 'LM' },
        { x: 38, y: 40, label: 'CM' },
        { x: 62, y: 40, label: 'CM' },
        { x: 85, y: 40, label: 'RM' },
        { x: 50, y: 18, label: 'ST' },
      ]
    },
    '4-5-1': {
      positions: [
        { x: 50, y: 90, label: 'GK' },
        { x: 15, y: 72, label: 'LB' },
        { x: 38, y: 72, label: 'CB' },
        { x: 62, y: 72, label: 'CB' },
        { x: 85, y: 72, label: 'RB' },
        { x: 10, y: 45, label: 'LM' },
        { x: 30, y: 45, label: 'CM' },
        { x: 50, y: 45, label: 'CM' },
        { x: 70, y: 45, label: 'CM' },
        { x: 90, y: 45, label: 'RM' },
        { x: 50, y: 18, label: 'ST' },
      ]
    },
    '4-3-2-1': {
      positions: [
        { x: 50, y: 90, label: 'GK' },
        { x: 15, y: 72, label: 'LB' },
        { x: 38, y: 72, label: 'CB' },
        { x: 62, y: 72, label: 'CB' },
        { x: 85, y: 72, label: 'RB' },
        { x: 25, y: 52, label: 'CM' },
        { x: 50, y: 52, label: 'CM' },
        { x: 75, y: 52, label: 'CM' },
        { x: 35, y: 33, label: 'CAM' },
        { x: 65, y: 33, label: 'CAM' },
        { x: 50, y: 16, label: 'ST' },
      ]
    },
    '4-3-1-2': {
      positions: [
        { x: 50, y: 90, label: 'GK' },
        { x: 15, y: 72, label: 'LB' },
        { x: 38, y: 72, label: 'CB' },
        { x: 62, y: 72, label: 'CB' },
        { x: 85, y: 72, label: 'RB' },
        { x: 25, y: 52, label: 'CM' },
        { x: 50, y: 52, label: 'CM' },
        { x: 75, y: 52, label: 'CM' },
        { x: 50, y: 35, label: 'CAM' },
        { x: 35, y: 18, label: 'ST' },
        { x: 65, y: 18, label: 'ST' },
      ]
    },
    '4-2-4': {
      positions: [
        { x: 50, y: 90, label: 'GK' },
        { x: 15, y: 72, label: 'LB' },
        { x: 38, y: 72, label: 'CB' },
        { x: 62, y: 72, label: 'CB' },
        { x: 85, y: 72, label: 'RB' },
        { x: 35, y: 50, label: 'CM' },
        { x: 65, y: 50, label: 'CM' },
        { x: 15, y: 18, label: 'LW' },
        { x: 40, y: 18, label: 'ST' },
        { x: 60, y: 18, label: 'ST' },
        { x: 85, y: 18, label: 'RW' },
      ]
    },
    '4-1-3-2': {
      positions: [
        { x: 50, y: 90, label: 'GK' },
        { x: 15, y: 72, label: 'LB' },
        { x: 38, y: 72, label: 'CB' },
        { x: 62, y: 72, label: 'CB' },
        { x: 85, y: 72, label: 'RB' },
        { x: 50, y: 58, label: 'CDM' },
        { x: 25, y: 40, label: 'CM' },
        { x: 50, y: 40, label: 'CM' },
        { x: 75, y: 40, label: 'CM' },
        { x: 35, y: 18, label: 'ST' },
        { x: 65, y: 18, label: 'ST' },
      ]
    },
    '3-4-3': {
      positions: [
        { x: 50, y: 90, label: 'GK' },
        { x: 25, y: 72, label: 'CB' },
        { x: 50, y: 72, label: 'CB' },
        { x: 75, y: 72, label: 'CB' },
        { x: 15, y: 48, label: 'LM' },
        { x: 38, y: 48, label: 'CM' },
        { x: 62, y: 48, label: 'CM' },
        { x: 85, y: 48, label: 'RM' },
        { x: 20, y: 18, label: 'LW' },
        { x: 50, y: 18, label: 'ST' },
        { x: 80, y: 18, label: 'RW' },
      ]
    },
    '3-4-1-2': {
      positions: [
        { x: 50, y: 90, label: 'GK' },
        { x: 25, y: 72, label: 'CB' },
        { x: 50, y: 72, label: 'CB' },
        { x: 75, y: 72, label: 'CB' },
        { x: 15, y: 50, label: 'LM' },
        { x: 38, y: 50, label: 'CM' },
        { x: 62, y: 50, label: 'CM' },
        { x: 85, y: 50, label: 'RM' },
        { x: 50, y: 33, label: 'CAM' },
        { x: 35, y: 18, label: 'ST' },
        { x: 65, y: 18, label: 'ST' },
      ]
    },
    '3-4-2-1': {
      positions: [
        { x: 50, y: 90, label: 'GK' },
        { x: 25, y: 72, label: 'CB' },
        { x: 50, y: 72, label: 'CB' },
        { x: 75, y: 72, label: 'CB' },
        { x: 15, y: 50, label: 'LM' },
        { x: 38, y: 50, label: 'CM' },
        { x: 62, y: 50, label: 'CM' },
        { x: 85, y: 50, label: 'RM' },
        { x: 35, y: 30, label: 'CF' },
        { x: 65, y: 30, label: 'CF' },
        { x: 50, y: 16, label: 'ST' },
      ]
    },
    '3-1-4-2': {
      positions: [
        { x: 50, y: 90, label: 'GK' },
        { x: 25, y: 72, label: 'CB' },
        { x: 50, y: 72, label: 'CB' },
        { x: 75, y: 72, label: 'CB' },
        { x: 50, y: 58, label: 'CDM' },
        { x: 15, y: 40, label: 'LM' },
        { x: 38, y: 40, label: 'CM' },
        { x: 62, y: 40, label: 'CM' },
        { x: 85, y: 40, label: 'RM' },
        { x: 35, y: 18, label: 'ST' },
        { x: 65, y: 18, label: 'ST' },
      ]
    },
    '5-3-2': {
      positions: [
        { x: 50, y: 90, label: 'GK' },
        { x: 10, y: 68, label: 'LWB' },
        { x: 30, y: 72, label: 'CB' },
        { x: 50, y: 72, label: 'CB' },
        { x: 70, y: 72, label: 'CB' },
        { x: 90, y: 68, label: 'RWB' },
        { x: 25, y: 45, label: 'CM' },
        { x: 50, y: 45, label: 'CM' },
        { x: 75, y: 45, label: 'CM' },
        { x: 35, y: 18, label: 'ST' },
        { x: 65, y: 18, label: 'ST' },
      ]
    },
    '5-4-1': {
      positions: [
        { x: 50, y: 90, label: 'GK' },
        { x: 10, y: 68, label: 'LWB' },
        { x: 30, y: 72, label: 'CB' },
        { x: 50, y: 72, label: 'CB' },
        { x: 70, y: 72, label: 'CB' },
        { x: 90, y: 68, label: 'RWB' },
        { x: 15, y: 45, label: 'LM' },
        { x: 38, y: 45, label: 'CM' },
        { x: 62, y: 45, label: 'CM' },
        { x: 85, y: 45, label: 'RM' },
        { x: 50, y: 18, label: 'ST' },
      ]
    },
    '5-2-1-2': {
      positions: [
        { x: 50, y: 90, label: 'GK' },
        { x: 10, y: 68, label: 'LWB' },
        { x: 30, y: 72, label: 'CB' },
        { x: 50, y: 72, label: 'CB' },
        { x: 70, y: 72, label: 'CB' },
        { x: 90, y: 68, label: 'RWB' },
        { x: 35, y: 48, label: 'CM' },
        { x: 65, y: 48, label: 'CM' },
        { x: 50, y: 33, label: 'CAM' },
        { x: 35, y: 18, label: 'ST' },
        { x: 65, y: 18, label: 'ST' },
      ]
    },
    '5-2-3': {
      positions: [
        { x: 50, y: 90, label: 'GK' },
        { x: 10, y: 68, label: 'LWB' },
        { x: 30, y: 72, label: 'CB' },
        { x: 50, y: 72, label: 'CB' },
        { x: 70, y: 72, label: 'CB' },
        { x: 90, y: 68, label: 'RWB' },
        { x: 35, y: 45, label: 'CM' },
        { x: 65, y: 45, label: 'CM' },
        { x: 20, y: 18, label: 'LW' },
        { x: 50, y: 18, label: 'ST' },
        { x: 80, y: 18, label: 'RW' },
      ]
    },
    '4-4-1-1': {
      positions: [
        { x: 50, y: 90, label: 'GK' },
        { x: 15, y: 72, label: 'LB' },
        { x: 38, y: 72, label: 'CB' },
        { x: 62, y: 72, label: 'CB' },
        { x: 85, y: 72, label: 'RB' },
        { x: 15, y: 48, label: 'LM' },
        { x: 38, y: 48, label: 'CM' },
        { x: 62, y: 48, label: 'CM' },
        { x: 85, y: 48, label: 'RM' },
        { x: 50, y: 30, label: 'CF' },
        { x: 50, y: 16, label: 'ST' },
      ]
    },
    '4-2-1-3': {
      positions: [
        { x: 50, y: 90, label: 'GK' },
        { x: 15, y: 72, label: 'LB' },
        { x: 38, y: 72, label: 'CB' },
        { x: 62, y: 72, label: 'CB' },
        { x: 85, y: 72, label: 'RB' },
        { x: 35, y: 55, label: 'CDM' },
        { x: 65, y: 55, label: 'CDM' },
        { x: 50, y: 38, label: 'CAM' },
        { x: 20, y: 18, label: 'LW' },
        { x: 50, y: 18, label: 'ST' },
        { x: 80, y: 18, label: 'RW' },
      ]
    },
    '4-3-3 (2)': {
      positions: [
        { x: 50, y: 90, label: 'GK' },
        { x: 15, y: 72, label: 'LB' },
        { x: 38, y: 72, label: 'CB' },
        { x: 62, y: 72, label: 'CB' },
        { x: 85, y: 72, label: 'RB' },
        { x: 50, y: 55, label: 'CDM' },
        { x: 30, y: 42, label: 'CM' },
        { x: 70, y: 42, label: 'CM' },
        { x: 20, y: 18, label: 'LW' },
        { x: 50, y: 18, label: 'ST' },
        { x: 80, y: 18, label: 'RW' },
      ]
    },
    '4-3-3 (4)': {
      positions: [
        { x: 50, y: 90, label: 'GK' },
        { x: 15, y: 72, label: 'LB' },
        { x: 38, y: 72, label: 'CB' },
        { x: 62, y: 72, label: 'CB' },
        { x: 85, y: 72, label: 'RB' },
        { x: 30, y: 52, label: 'CM' },
        { x: 70, y: 52, label: 'CM' },
        { x: 50, y: 35, label: 'CAM' },
        { x: 20, y: 18, label: 'LW' },
        { x: 50, y: 18, label: 'ST' },
        { x: 80, y: 18, label: 'RW' },
      ]
    },
    '4-4-2 (2)': {
      positions: [
        { x: 50, y: 90, label: 'GK' },
        { x: 15, y: 72, label: 'LB' },
        { x: 38, y: 72, label: 'CB' },
        { x: 62, y: 72, label: 'CB' },
        { x: 85, y: 72, label: 'RB' },
        { x: 15, y: 48, label: 'LM' },
        { x: 38, y: 52, label: 'CDM' },
        { x: 62, y: 52, label: 'CDM' },
        { x: 85, y: 48, label: 'RM' },
        { x: 35, y: 18, label: 'ST' },
        { x: 65, y: 18, label: 'ST' },
      ]
    },
  },
};

export const PITCH_DIMENSIONS = {
  '5v5': { width: 40, height: 25 },
  '7v7': { width: 60, height: 40 },
  '11v11': { width: 105, height: 68 },
};

export const POSITION_COLORS: Record<string, string> = {
  GK: '#ffeb3b',
  CB: '#4caf50',
  LB: '#4caf50',
  RB: '#4caf50',
  CDM: '#2196f3',
  CM: '#2196f3',
  CAM: '#2196f3',
  LM: '#2196f3',
  RM: '#2196f3',
  LWB: '#00bcd4',
  RWB: '#00bcd4',
  LW: '#f44336',
  RW: '#f44336',
  ST: '#f44336',
  CF: '#ff5722',
};
