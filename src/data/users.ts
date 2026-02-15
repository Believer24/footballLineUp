export type UserRole = 'captain' | 'manager' | 'player';

export const ROLE_LABELS: Record<UserRole, string> = {
  captain: '队长',
  manager: '领队',
  player: '队员',
};

export const canEdit = (role: UserRole): boolean => {
  return role === 'captain' || role === 'manager';
};
