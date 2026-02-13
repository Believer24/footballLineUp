export type UserRole = 'captain' | 'manager' | 'player';

export interface User {
  username: string;
  password: string;
  displayName: string;
  role: UserRole;
}

// Default accounts
export const USERS: User[] = [
  { username: 'captain', password: '123456', displayName: '队长', role: 'captain' },
  { username: 'manager', password: '123456', displayName: '领队', role: 'manager' },
  { username: 'player1', password: '123456', displayName: '球员1', role: 'player' },
  { username: 'player2', password: '123456', displayName: '球员2', role: 'player' },
];

export const ROLE_LABELS: Record<UserRole, string> = {
  captain: '队长',
  manager: '领队',
  player: '队员',
};

export const canEdit = (role: UserRole): boolean => {
  return role === 'captain' || role === 'manager';
};
